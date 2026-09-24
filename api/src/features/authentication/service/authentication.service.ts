import { db } from "../../../core/database/db.js";
import { leaveBalances, leaveTypes, users } from "../../../core/database/schema/index.js";
import { AppError } from "../../../core/errors/app.error.js";
import { NotFoundError } from "../../../core/errors/not-found.error.js";
import { UnauthorizedError } from "../../../core/errors/unauthorized.error.js";
import { logger } from "../../../core/logger/logger.js";
import { generateAccessToken } from "../../../core/security/jwt.js";
import { comparePassword, hashPassword } from "../../../core/security/password.js";
import type { LoginRequestDto } from "../dto/request/login.request.js";
import type { RegisterRequestDto } from "../dto/request/register.request.js";
import { type LoginResult, toLoginResponse } from "../dto/response/login.response.js";
import { toUserResponse, type UserResponseDto } from "../dto/response/user.response.js";
import { findUserByEmail, findUserByPublicId } from "../repository/authentication.repository.js";
import { type AuthRequestMetadata, DEFAULT_USER_ROLE } from "../types/authentication.types.js";
import { createUserSession } from "./authentication-session.service.js";

/** Current year for balance provisioning — consistent with the balance queries. */
function currentYear(): number {
  return new Date().getFullYear();
}

export async function register(
  dto: RegisterRequestDto,
  metadata: AuthRequestMetadata = {}
): Promise<LoginResult> {
  const normalizedEmail = dto.email.toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    logger.warn({ email: normalizedEmail }, "Register blocked: email already exists");
    throw new AppError("Error creating user", 409);
  }

  const passwordHash = await hashPassword(dto.password);

  // ── One transaction: user + balances are created together or not at all ──
  const user = await db.transaction(async (tx) => {
    // Leave types must exist (seed ran). Fail loudly rather than
    // silently creating a balance-less user — that silent failure
    // is exactly the bug this block fixes.
    const allLeaveTypes = await tx.select().from(leaveTypes);
    if (allLeaveTypes.length === 0) {
      logger.error("Register blocked: no leave types exist — seed the database");
      throw new AppError("Service is not configured for registrations", 503);
    }

    const [created] = await tx
      .insert(users)
      .values({
        name: dto.name,
        email: normalizedEmail,
        passwordHash,
        role: DEFAULT_USER_ROLE,
      })
      .returning();

    if (!created) throw new AppError("Error creating user", 500);

    // ── THE MISSING BLOCK: provision one balance per leave type ──────────
    await tx.insert(leaveBalances).values(
      allLeaveTypes.map((type) => ({
        userId: created.id,
        leaveTypeId: type.id,
        year: currentYear(),
        allowanceDays: type.defaultAllowance,
        usedDays: 0,
      }))
    );

    return created;
  });

  const { token: accessToken, expiresInSeconds } = generateAccessToken({
    publicId: user.publicId,
    role: user.role,
  });

  const refreshToken = await createUserSession(user.id, metadata);

  return {
    response: toLoginResponse(
      {
        publicId: user.publicId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      expiresInSeconds
    ),
    refreshToken,
  };
}

export async function login(
  dto: LoginRequestDto,
  metadata: AuthRequestMetadata = {}
): Promise<LoginResult> {
  const normalizedEmail = dto.email.toLowerCase();

  const user = await findUserByEmail(normalizedEmail);

  const passwordMatch = await comparePassword(
    dto.password,
    user?.passwordHash ?? "$2b$12$InvalidHashForTimingNormalization"
  );

  if (!user || !passwordMatch) {
    logger.warn({ email: normalizedEmail }, "Login failed: invalid credentials");
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.isActive) {
    logger.warn({ userId: user.publicId }, "Login blocked: inactive user");
    throw new UnauthorizedError("Account is disabled");
  }

  const { token: accessToken, expiresInSeconds } = generateAccessToken({
    publicId: user.publicId,
    role: user.role,
  });

  const refreshToken = await createUserSession(user.id, metadata);

  return {
    response: toLoginResponse(
      { publicId: user.publicId, name: user.name, email: user.email, role: user.role },
      accessToken,
      expiresInSeconds
    ),
    refreshToken,
  };
}

export async function me(publicId: string): Promise<UserResponseDto> {
  const user = await findUserByPublicId(publicId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return toUserResponse({
    publicId: user.publicId,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
