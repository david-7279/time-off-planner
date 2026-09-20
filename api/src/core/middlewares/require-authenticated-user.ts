// src/core/middlewares/require-authenticated-user.ts

import type { Request } from "express";
import type { AuthenticatedUser } from "../../features/authentication/types/authentication.types.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";

/**
 * Retrieves the authenticated user from the request.
 * @param req The request object
 */
export function getAuthUser(req: Request): AuthenticatedUser {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }
  return req.user;
}
