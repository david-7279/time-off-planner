import { randomUUID } from "node:crypto";
import type { Algorithm, JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../../features/authentication/types/authentication.types.js";
import { env } from "../config/env.config.js";
import type { AccessTokenPayload, TokenUser } from "./types/jwt.types.js";

export type GeneratedToken = {
  token: string;
  expiresInSeconds: number;
};

const JWT_ALGORITHM: Algorithm = "HS256";

const JWT_SIGN_OPTIONS = {
  issuer: env.jwt.issuer,
  audience: env.jwt.audience,
  algorithm: JWT_ALGORITHM,
} as const satisfies SignOptions;

const JWT_VERIFY_OPTIONS: jwt.VerifyOptions = {
  issuer: env.jwt.issuer,
  audience: env.jwt.audience,
  algorithms: [JWT_ALGORITHM],
};

function isAccessTokenPayload(decoded: string | JwtPayload): decoded is AccessTokenPayload {
  return (
    typeof decoded !== "string" &&
    typeof decoded.sub === "string" &&
    typeof decoded.role === "string" &&
    typeof decoded.jti === "string" &&
    (USER_ROLES as readonly string[]).includes(decoded.role)
  );
}

export function generateAccessToken(user: TokenUser): GeneratedToken {
  return {
    token: jwt.sign({ role: user.role }, env.jwt.accessSecret, {
      ...JWT_SIGN_OPTIONS,
      subject: user.publicId,
      jwtid: randomUUID(),
      expiresIn: env.jwt.accessExpiresIn as SignOptions["expiresIn"],
    }),
    expiresInSeconds: env.jwt.accessExpiresInSeconds,
  };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwt.accessSecret, JWT_VERIFY_OPTIONS);

  if (!isAccessTokenPayload(decoded)) {
    throw new jwt.JsonWebTokenError("Invalid token payload");
  }

  return decoded;
}
