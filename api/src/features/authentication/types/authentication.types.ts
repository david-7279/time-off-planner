import type { UUID } from "node:crypto";

export type UserRole = "user" | "admin";

export const USER_ROLES: readonly UserRole[] = ["user", "admin"] as const;

export const DEFAULT_USER_ROLE: UserRole = "user";

export type AuthenticatedUser = {
  publicId: UUID;
  role: UserRole;
};

export type AuthRequestMetadata = {
  ipAddress?: string;
  userAgent?: string;
};
