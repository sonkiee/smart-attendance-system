import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const lecturers = pgTable("lecturers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  staffNumber: varchar("staff_number", { length: 50 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  department: varchar("department", { length: 100 }).notNull(),
});
