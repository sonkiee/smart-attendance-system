import "dotenv/config";

interface EnvConfig {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  LOG_LEVEL?: string;
}

const requiredEnvVars: (keyof EnvConfig)[] = ["DATABASE_URL"];

// In production, require JWT_SECRET to be defined
if (process.env.NODE_ENV === "production") {
  requiredEnvVars.push("JWT_SECRET");
}

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}`,
  );
}

export const env: EnvConfig = {
  NODE_ENV: (process.env.NODE_ENV as any) || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET || "development-secret-key-1234567890",
};
