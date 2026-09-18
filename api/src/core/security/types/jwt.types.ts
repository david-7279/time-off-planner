import type { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "../../../features/authentication/types/authentication.types.js";

export type AccessTokenPayload = JwtPayload & {
  sub: string;
  role: UserRole;
};

export type TokenUser = {
  publicId: string;
  role: UserRole;
};
