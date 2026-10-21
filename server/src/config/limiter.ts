import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 200,
  message: "Too many requests from this IP, please try again later.",
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: isDev ? 1000 : 20,
  message: "Too many login attempts from this IP, please try again later.",
});
