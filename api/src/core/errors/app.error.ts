// src/core/errors/app.error.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly publicMessage?: string;

  constructor(message: string, statusCode = 500, publicMessage?: string) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
