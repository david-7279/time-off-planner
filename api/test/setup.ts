import "dotenv/config.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.test");

process.env.NODE_ENV = "test";

import dotenv from "dotenv";

dotenv.config({ path: envPath });
