import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { env } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    ok: false,
    message: err.message || "Internal Server Error",
    stack: env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
