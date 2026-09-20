// src/app.ts

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { corsOptions } from "./core/config/cors.config.js";
import { env } from "./core/config/env.config.js";
import { helmetConfig } from "./core/config/helmet.config.js";
import { authenticationLimiter, globalLimiter } from "./core/config/rate-limit.config.js";
import { notFoundMiddleware } from "./core/middlewares/not-found.middleware.js";
import authenticationRoute from "./features/authentication/routes/authentication.route.js";
import leaveRequestsRoute from "./features/leave-requests/routes/leave-requests.route.js";

const app = express();

const version = "v1";
const apiBase = `/api/${version}`;

app.disable("x-powered-by");

if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet(helmetConfig));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(`${apiBase}/auth`, authenticationLimiter, authenticationRoute);
app.use(`${apiBase}/leave-requests`, leaveRequestsRoute);

app.use(notFoundMiddleware);

export default app;
