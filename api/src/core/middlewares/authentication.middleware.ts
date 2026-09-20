// src/core/middlewares/authentication.middleware.ts

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByPublicId } from "../../features/authentication/repository/authentication.repository.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { verifyAccessToken } from "../security/jwt.js";

/**
 * Authenticates a user based on the provided access token.
 * @param req The request object
 * @param _res The response object
 * @param next The next middleware function
 */
export async function authenticateMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new UnauthorizedError("Authentication required"));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    const user = await findUserByPublicId(payload.sub);
    if (!user?.isActive) {
      next(new UnauthorizedError("User not found or inactive"));
      return;
    }

    req.user = {
      id: user.id,
      publicId: user.publicId,
      role: user.role,
      teamId: user.teamId,
    };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Token expired"));
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid token"));
      return;
    }
    next(err);
  }
}
