// src/core/errors/validation.error.ts

import { AppError } from "./app.error.js";

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}
