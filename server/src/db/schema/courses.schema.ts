import { integer, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { students } from "./students.schema.js";
import { lecturers } from "./lecturers.schema.js";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

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

export const courseLecturers = pgTable("course_lecturers", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  lecturerId: uuid("lecturer_id")
    .references(() => lecturers.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  unique("course_lecturer_unique").on(t.courseId, t.lecturerId),
]);

export type Course = InferSelectModel<typeof courses>;
export type NewCourse = InferInsertModel<typeof courses>;

export type CourseEnrollment = InferSelectModel<typeof courseEnrollments>;
export type NewCourseEnrollment = InferInsertModel<typeof courseEnrollments>;

export type CourseLecturer = InferSelectModel<typeof courseLecturers>;
export type NewCourseLecturer = InferInsertModel<typeof courseLecturers>;

export const courseReps = pgTable("course_reps", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  studentId: uuid("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (t) => [
  unique("course_rep_unique").on(t.courseId, t.studentId),
]);

export type CourseRep = InferSelectModel<typeof courseReps>;
export type NewCourseRep = InferInsertModel<typeof courseReps>;
