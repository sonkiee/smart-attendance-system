import { Request, Response } from "express";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "MFA Attendance System Server API is running.",
    status: "healthy",
  });
});

(async () => {
  try {
    console.info("Checking DB connection...");

    const client = await (await import("./db")).pool.connect();
    await client.query("SELECT 1"); // Test the database connection
    client.release();
    console.info("Postgres connected");

    console.info("Starting server...");
    app.listen(PORT, () => {
      console.log(
        `Server is running on http://localhost:${PORT} in ${NODE_ENV} mode`,
      );
    });
  } catch (error) {
    console.error("Error starting server");
    process.exit(1);
  }
})();
