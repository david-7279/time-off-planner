// src/core/config/cors.config.ts

import type { CorsOptions } from "cors";
import { env } from "./env.config.js";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.server.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
