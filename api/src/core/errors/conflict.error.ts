// src/core/errors/conflict.error.ts

import { AppError } from "./app.error.js";

export class ConflictError extends AppError {
  constructor(message = "Conflict with the current state of the resource") {
    super(message, 409);
  }
}
