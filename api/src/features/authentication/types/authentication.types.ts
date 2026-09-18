export type UserRole = "user" | "admin";

export const USER_ROLES: readonly UserRole[] = ["user", "admin"] as const;

export const DEFAULT_USER_ROLE: UserRole = "user";
