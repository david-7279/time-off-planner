import type { UUID } from "node:crypto";
import type { UserRole } from "../../types/authentication.types.js";
import type { AuthUserDto } from "./authentication.response.js";

export type UserResponseDto = {
  publicId: UUID;
  name: string;
  email: string;
  role: UserRole;
};

export function toUserResponse(user: AuthUserDto): UserResponseDto {
  return {
    publicId: user.publicId,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
