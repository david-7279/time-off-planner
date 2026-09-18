import express from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"

import {env} from "./core/config/env.config.js"
import {corsOptions} from "./core/config/cors.config.js"
import {helmetConfig} from "./core/config/helmet.config.js"
import {globalLimiter} from "./core/config/rate-limit.config.js"

const app = express()

/*
 * Hide the identity of the server technology from potential attackers
*/
app.disable("x-powered-by")

if (env.nodeEnv === "production") {
    app.set("trust proxy", 1)
}

app.use(helmet(helmetConfig))
app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.json({limit: "10kb"}))
app.use(globalLimiter)

export default app