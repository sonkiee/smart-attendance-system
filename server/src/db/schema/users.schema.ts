import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums.js";
import {
  defineRelations,
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";
import * as schema from "../schema";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  passwordHash: text("password_hash").notNull(),

  role: userRoleEnum("role").notNull(),

  isActive: boolean("is_active").notNull().default(true),

  isActivated: boolean("is_activated").notNull().default(false),

  deviceId: varchar("device_id", { length: 255 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
