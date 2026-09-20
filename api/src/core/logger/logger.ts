// src/core/logger/logger.ts

import pino from "pino";
import { env } from "../config/env.config.js";

export const logger = pino({
  level: env.logger.level,
  redact: {
    paths: [
      "password",
      "passwordHash",
      "password_hash",
      "token",
      "accessToken",
      "refreshToken",
      "authorization",
      "req.headers.authorization",
    ],
    censor: "[REDACTED]",
  },
  transport:
    env.nodeEnv !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
