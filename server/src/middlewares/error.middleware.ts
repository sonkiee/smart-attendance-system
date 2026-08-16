import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { env } from "../config/env.js";
import { logger } from "@/config/logger.js";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const message = err.message || "Internal Server Error";
  logger.error(
    `Error: ${message} - ${req.method} ${req.originalUrl} - ${req.ip} - ${err.stack}`,
  );
  res.status(statusCode).json({
    ok: false,
    message: message,
    stack: env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
