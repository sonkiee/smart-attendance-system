import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/index.routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { logger } from "./config/logger";
import { globalLimiter } from "./config/limiter.js";

export const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Apply global rate limiter
app.use(globalLimiter);

// API Routes
app.use(routes);

// 404 Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);
