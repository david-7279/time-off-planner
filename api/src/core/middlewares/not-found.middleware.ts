// core/middlewares/not-found.middleware.ts

import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error.js";

/**
 * Middleware to handle 404 Not Found errors.
 * @param req The request object.
 * @param _res The response object.
 * @param next The next middleware function.
 */
export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
}
