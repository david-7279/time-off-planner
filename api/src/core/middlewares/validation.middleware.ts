import type { NextFunction, Request, Response } from "express";
import { type ValidationError, validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors: Record<string, string[]> = {};

  errors.array().forEach((error: ValidationError) => {
    const key = "path" in error ? error.path : "unknown";

    if (!formattedErrors[key]) {
      formattedErrors[key] = [];
    }

    formattedErrors[key].push(error.msg);
  });

  return res.status(400).json({
    success: false,
    errors: formattedErrors,
  });
}
