import { boolean, date, doublePrecision, jsonb, pgTable, time, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { lectureSchedules } from "./schedules.schema.js";
import { students } from "./students.schema.js";
import { sessionStatusEnum, attendanceStatusEnum } from "./enums.js";

export const attendanceSessions = pgTable("attendance_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  scheduleId: uuid("schedule_id")
    .references(() => lectureSchedules.id, { onDelete: "cascade" })
    .notNull(),
  sessionDate: date("session_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  attendanceCode: varchar("attendance_code", { length: 50 }).notNull(),
  status: sessionStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => attendanceSessions.id, { onDelete: "cascade" })
    .notNull(),
  studentId: uuid("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  distanceMeters: doublePrecision("distance_meters"),
  locationVerified: boolean("location_verified").default(false).notNull(),
  codeVerified: boolean("code_verified").default(false).notNull(),
  status: attendanceStatusEnum("status").default("absent").notNull(),
  markedAt: timestamp("marked_at", { withTimezone: true }),
}, (t) => [
  unique("session_student_attendance_unique").on(t.sessionId, t.studentId),
]);

export const verificationLogs = pgTable("verification_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  attendanceId: uuid("attendance_id")
    .references(() => attendanceRecords.id, { onDelete: "cascade" })
    .notNull(),
  factor: varchar("factor", { length: 50 }).notNull(),
  result: boolean("result").notNull(),
  details: jsonb("details"),
  verifiedAt: timestamp("verified_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
