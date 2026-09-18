import app from "./app.js";
import { env } from "./core/config/env.config.js";
import { connectDatabase, pool } from "./core/database/pool.js";
import { logger } from "./core/logger/logger.js";

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(env.server.port, () => {
    logger.info(`Server running on port ${env.server.port}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);

    const forceExit = setTimeout(() => {
      logger.error("Graceful shutdown timed out, forcing exit");
      process.exit(1);
    }, env.server.shutdownTimeoutMs);

    forceExit.unref();

    server.close(async () => {
      try {
        await pool.end();
        logger.info("Server closed");
        process.exit(0);
      } catch (err) {
        logger.error({ err }, "Error during database shutdown");
        process.exit(1);
      }
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "Uncaught exception");
    shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    logger.fatal({ reason }, "Unhandled promise rejection");
    shutdown("unhandledRejection");
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
