import { boolean, date, doublePrecision, integer, jsonb, pgTable, time, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { students } from "./students.schema.js";
import { courses } from "./courses.schema.js";
import { lecturers } from "./lecturers.schema.js";
import { venues } from "./venues.schema.js";
import { users } from "./users.schema.js";
import { sessionStatusEnum, attendanceStatusEnum } from "./enums.js";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const attendanceSessions = pgTable("attendance_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  lecturerId: uuid("lecturer_id")
    .references(() => lecturers.id, { onDelete: "cascade" })
    .notNull(),
  venueId: uuid("venue_id")
    .references(() => venues.id, { onDelete: "set null" }),
  sessionDate: date("session_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  attendanceCode: varchar("attendance_code", { length: 50 }).notNull(),
  status: sessionStatusEnum("status").default("active").notNull(),
  allowRepMarking: boolean("allow_rep_marking").default(false).notNull(),
  lateThresholdMinutes: integer("late_threshold_minutes").default(15).notNull(),
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
  bleVerified: boolean("ble_verified").default(false).notNull(),
  isManual: boolean("is_manual").default(false).notNull(),
  deviceId: varchar("device_id", { length: 255 }),
  markedById: uuid("marked_by_id")
    .references(() => users.id, { onDelete: "set null" }),
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

export type AttendanceSession = InferSelectModel<typeof attendanceSessions>;
export type NewAttendanceSession = InferInsertModel<typeof attendanceSessions>;

export type AttendanceRecord = InferSelectModel<typeof attendanceRecords>;
export type NewAttendanceRecord = InferInsertModel<typeof attendanceRecords>;

export type VerificationLog = InferSelectModel<typeof verificationLogs>;
export type NewVerificationLog = InferInsertModel<typeof verificationLogs>;
