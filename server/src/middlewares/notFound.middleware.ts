import { logger } from "@/config/logger";
import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = `path not found: ${req.originalUrl}`;
  logger.warn(error);
  return res.status(404).json({
    ok: false,
    message: error,
  });
};
