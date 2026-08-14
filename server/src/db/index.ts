import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env.js";
import * as schema from "./schema";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  //   ssl: { rejectUnauthorized: false },
});

export const db = drizzle({ client: pool });
