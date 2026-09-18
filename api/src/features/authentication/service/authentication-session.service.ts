import { env } from "../../../core/config/env.config.js";
import {
  generateRefreshToken,
  getRefreshTokenExpiresAt,
  hashRefreshToken,
} from "../../../core/security/token.js";
import { createSession } from "../repository/authentication.repository.js";
import type { AuthRequestMetadata } from "../types/authentication.types.js";

export async function createUserSession(
  userId: number,
  metadata: AuthRequestMetadata = {}
): Promise<string> {
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  await createSession({
    userId,
    refreshTokenHash,
    expiresAt: getRefreshTokenExpiresAt(env.jwt.refreshExpiresInDays),
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
  });

  return refreshToken;
}
