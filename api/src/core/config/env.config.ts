// src/core/config/env.config.ts

import "dotenv/config";

type NodeEnv = "development" | "test" | "production";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnv(name: string, fallback: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    return fallback;
  }

  return value;
}

function getNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  // Strict: reject hex ("0x10"), exponents ("1e3"), and any numeric-looking
  // strings that aren't valid decimal numbers.
  if (!Number.isFinite(parsedValue) || !/^-?\d+(\.\d+)?$/.test(value)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return parsedValue;
}

function getStringListEnv(name: string, fallback: string[] = []): string[] {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    return fallback;
  }

  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getNodeEnv(): NodeEnv {
  const value = getOptionalEnv("NODE_ENV", "development");

  if (value !== "development" && value !== "test" && value !== "production") {
    throw new Error("NODE_ENV must be one of: development, test, production");
  }

  return value;
}

function parseExpiresIn(value: string): number {
  const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  const match = value.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid JWT expiry format "${value}" — expected format: 15m, 1h, 7d`);
  }

  return parseInt(match[1], 10) * units[match[2]];
}

const nodeEnv = getNodeEnv();
const accessExpiresIn = getOptionalEnv("JWT_ACCESS_EXPIRES_IN", "15m");
const refreshExpiresInDays = getNumberEnv("JWT_REFRESH_EXPIRES_IN_DAYS", 7);

export const env = {
  nodeEnv,

  server: {
    port: getNumberEnv("PORT", 3000),
    shutdownTimeoutMs: getNumberEnv("SHUTDOWN_TIMEOUT_MS", 10_000),
    allowedOrigins: getStringListEnv("ALLOWED_ORIGINS", [
      "http://localhost:5173",
      "http://localhost:3000",
    ]),
  },

  rateLimit: {
    windowMs: getNumberEnv("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
    max: getNumberEnv("RATE_LIMIT_MAX", 100),
    authWindowMs: getNumberEnv("RATE_LIMIT_AUTH_WINDOW_MS", 15 * 60 * 1000),
    authMax: getNumberEnv("RATE_LIMIT_AUTH_MAX", 10),
  },

  database: {
    url: getRequiredEnv("DATABASE_URL"),
    pool: {
      max: getNumberEnv("DB_POOL_MAX", 10),
      idleTimeoutMillis: getNumberEnv("DB_POOL_IDLE_TIMEOUT_MS", 30_000),
      connectionTimeoutMillis: getNumberEnv("DB_POOL_CONNECTION_TIMEOUT_MS", 2_000),
    },
  },

  jwt: {
    accessSecret: getRequiredEnv("JWT_ACCESS_SECRET"),
    accessExpiresIn,
    accessExpiresInSeconds: parseExpiresIn(accessExpiresIn),
    refreshExpiresInDays,
    refreshExpiresInMs: refreshExpiresInDays * 24 * 60 * 60 * 1000,
    issuer: "time-off-api",
    audience: "time-off-api",
  },

  logger: {
    level: getOptionalEnv("LOG_LEVEL", nodeEnv === "production" ? "info" : "debug"),
  },
} as const;
