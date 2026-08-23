import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { env } from "../config/env.js";
import { logger } from "@/config/logger.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  logger.error(
    `Error: ${err.message} - ${req.method} ${req.originalUrl} - ${req.ip} - ${err.stack}`,
  );

  res.status(statusCode).json({
    ok: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message || "Something went wrong",
    ...(env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};
