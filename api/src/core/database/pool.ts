import pg from "pg";
import {env} from "../config/env.config.js";
import {logger} from "../logger/logger.js";

export const pool = new pg.Pool({
    connectionString: env.database.url,
    max: env.database.pool.max,
    idleTimeoutMillis: env.database.pool.idleTimeoutMillis,
    connectionTimeoutMillis: env.database.pool.connectionTimeoutMillis,
});

pool.on("error", (err) => {
    logger.error({err}, "Unexpected PostgreSQL pool error");
});

export async function connectDatabase(): Promise<void> {
    const client = await pool.connect();

    try {
        await client.query("SELECT 1");
        logger.info("Database connection established");
    } catch (err) {
        logger.error({err}, "Error occurred while testing database connection");
    } finally {
        client.release();
    }
}
