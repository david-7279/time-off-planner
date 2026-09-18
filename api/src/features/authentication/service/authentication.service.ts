import { AppError } from "../../../core/errors/app.error.js";
import { UnauthorizedError } from "../../../core/errors/unauthorized.error.js";
import { logger } from "../../../core/logger/logger.js";
import { generateAccessToken } from "../../../core/security/jwt.js";
import { comparePassword, hashPassword } from "../../../core/security/password.js";
import type { LoginRequestDto } from "../dto/request/login.request.js";
import type { RegisterRequestDto } from "../dto/request/register.request.js";
import { type LoginResult, toLoginResponse } from "../dto/response/login.response.js";
import { createUser, findUserByEmail } from "../repository/authentication.repository.js";
import { type AuthRequestMetadata, DEFAULT_USER_ROLE } from "../types/authentication.types.js";
import { createUserSession } from "./authentication-session.service.js";

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

  const user = await createUser({
    name: dto.name,
    email: dto.email,
    passwordHash,
    role: DEFAULT_USER_ROLE,
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
