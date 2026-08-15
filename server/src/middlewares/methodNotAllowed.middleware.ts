import { logger } from "@/config/logger";
import { Request, Response } from "express";

export const methodNotAllowed = (req: Request, res: Response) => {
  const error = `method ${req.method} not allowed at: ${req.originalUrl}`;
  logger.warn(error);
  return res.status(405).json({
    ok: false,
    message: error,
  });
};
