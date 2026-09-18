import type { UUID } from "node:crypto";
import type { UserRole } from "../../types/authentication.types.js";
import { type TokenResponseDto, toTokenResponse } from "./token.response.js";
import { toUserResponse, type UserResponseDto } from "./user.response.js";

export type AuthUserDto = {
  publicId: UUID;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponseDto = {
  user: UserResponseDto;
  token: TokenResponseDto;
};

export function toAuthResponse(
  user: AuthUserDto,
  accessToken: string,
  expiresInSeconds: number
): AuthResponseDto {
  return {
    user: toUserResponse(user),
    token: toTokenResponse(accessToken, expiresInSeconds),
  };
}
