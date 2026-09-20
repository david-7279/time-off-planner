// src/core/middlewares/error.middleware.ts

import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error.js";
import { logger } from "../logger/logger.js";

const FALLBACK_MESSAGES: Record<number, string> = {
  400: "Invalid request",
  401: "Authentication required",
  403: "Access denied",
  404: "Resource not found",
  409: "Conflict with the current state of the resource",
  422: "Unprocessable entity",
  429: "Too many requests",
  500: "Internal server error",
};

/**
 * Error handling middleware
 * @param err The error object
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 */
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  if (isAppError) {
    logger.warn({ statusCode, method: req.method, url: req.originalUrl }, err.message);
  } else {
    logger.error({ err, method: req.method, url: req.originalUrl, ip: req.ip }, "Unhandled error");
  }

  const clientMessage = isAppError
    ? (err.publicMessage ?? FALLBACK_MESSAGES[statusCode] ?? "An error occurred")
    : FALLBACK_MESSAGES[500];

  res.status(statusCode).json({
    success: false,
    error: { message: clientMessage },
  });
}
