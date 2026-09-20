// src/core/middlewares/validation.middleware.ts

import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

/**
 * Validates the user input
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 */
export function validationMiddleware(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  const fields: Record<string, string[]> = {};

  for (const error of errors.array({ onlyFirstError: true })) {
    if (error.type !== "field") continue;

    const key = error.path;
    if (!fields[key]) {
      fields[key] = [];
    }
    fields[key].push(error.msg);
  }

  res.status(400).json({
    success: false,
    error: {
      message: "Validation failed",
      fields,
    },
  });
}
