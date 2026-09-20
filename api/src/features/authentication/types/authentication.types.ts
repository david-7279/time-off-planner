export const USER_ROLES = ["member", "manager"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = "member";

export type AuthenticatedUser = {
  id: number;
  publicId: string;
  role: UserRole;
  teamId: number | null;
};

export type AuthRequestMetadata = {
  ipAddress?: string;
  userAgent?: string;
};
