import pino from "pino";
import { env } from "../config/env.config.js";

export const logger = pino({
    level: env.logger.level,
    transport: env.nodeEnv !== "production"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
});