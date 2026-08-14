import { integer, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { students } from "./students.schema.js";

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseCode: varchar("course_code", { length: 20 }).notNull().unique(),
  courseTitle: varchar("course_title", { length: 255 }).notNull(),
  unit: integer("unit").notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  level: integer("level").notNull(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  unique("student_course_enrollment_unique").on(t.studentId, t.courseId),
]);
