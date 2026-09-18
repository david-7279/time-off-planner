import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error.js";
import { logger } from "../logger/logger.js";

const FALLBACK_MESSAGES: Record<number, string> = {
  400: "Invalid request",
  401: "Authentication required",
  403: "Access denied",
  404: "Resource not found",
  422: "Unprocessable entity",
  429: "Too many requests",
  500: "Internal server error",
};

export function errorMiddleware(err: Error, req: Request, res: Response, _next: NextFunction) {
  const isAppError = err instanceof AppError;

  if (!isAppError) {
    logger.error({ err, req: { method: req.method, url: req.url, ip: req.ip } }, "Unhandled error");
  } else {
    logger.warn({ err, req: { method: req.method, url: req.url } }, err.message);
  }

  const statusCode = isAppError ? err.statusCode : 500;

  const clientMessage = isAppError
    ? (err.publicMessage ?? FALLBACK_MESSAGES[statusCode] ?? "An error occurred")
    : "Internal server error";

  return res.status(statusCode).json({
    success: false,
    error: { message: clientMessage },
  });
}
