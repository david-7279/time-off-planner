import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { env } from "../config/env.config.js";
import { logger } from "../logger/logger.js";
import { connectDatabase, pool } from "./pool.js";

const MIGRATIONS_DIR = join(
  process.cwd(),
  env.nodeEnv === "production" ? "dist/core/database/migrations" : "src/core/database/migrations"
);

async function runMigrations(): Promise<void> {
  await connectDatabase();

  await pool.query(`
        CREATE TABLE IF NOT EXISTS _migrations
        (
            id
            SERIAL
            PRIMARY
            KEY,
            filename
            TEXT
            NOT
            NULL
            UNIQUE,
            executed_at
            TIMESTAMPTZ
            NOT
            NULL
            DEFAULT
            NOW
        (
        )
            )
    `);

  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const already = await pool.query("SELECT 1 FROM _migrations WHERE filename = $1", [file]);

    if (already.rows.length > 0) {
      logger.info(`Skipping migration: ${file}`);
      continue;
    }

    const sql = await readFile(join(MIGRATIONS_DIR, file), "utf-8");
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO _migrations (filename) VALUES ($1)", [file]);
      await client.query("COMMIT");
      logger.info(`Executed migration: ${file}`);
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error({ err, file }, `Migration failed: ${file}`);
      throw err;
    } finally {
      client.release();
    }
  }

  logger.info("All migrations complete");
  await pool.end();
}

runMigrations().catch((err) => {
  logger.error({ err }, "Migration failed");
  process.exit(1);
});
