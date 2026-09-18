import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../../features/authentication/types/authentication.types.js";
import { ForbiddenError } from "../errors/forbidden.error.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
}
