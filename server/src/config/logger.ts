import pino from "pino";
import { env } from "./env";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",

  ...(process.env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
});

export { logger };
