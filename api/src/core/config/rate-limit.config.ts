import rateLimit from "express-rate-limit";
import { env } from "./env.config.js";

const rateLimitMessage = {
  success: false,
  error: {
    message: "Too many requests, please try again later",
  },
};

export const globalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const actuatorLimiter = rateLimit({
  windowMs: env.rateLimit.actuatorWindowMs,
  max: env.rateLimit.actuatorMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const authenticationLimiter = rateLimit({
  windowMs: env.rateLimit.authWindowMs,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: "Too many requests, please try again later" },
  },
});
