export const USER_ROLES = ["member", "manager"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = "member";

export type AuthenticatedUser = {
  publicId: string;
  role: UserRole;
};

export type AuthRequestMetadata = {
  ipAddress?: string;
  userAgent?: string;
};
