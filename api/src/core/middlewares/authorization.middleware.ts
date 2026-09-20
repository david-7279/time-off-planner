// src/core/middlewares/authorization.middleware.ts

import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../../features/authentication/types/authentication.types.js";
import { ForbiddenError } from "../errors/forbidden.error.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { logger } from "../logger/logger.js";

/**
 * Role-based authorization factory.
 * @param roles - the roles allowed to proceed
 * @returns a middleware function
 */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        {
          userId: req.user.publicId,
          role: req.user.role,
          allowedRoles: roles,
          path: req.originalUrl,
        },
        "Authorization denied"
      );
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
}
