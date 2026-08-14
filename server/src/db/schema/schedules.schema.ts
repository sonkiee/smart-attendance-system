import { pgTable, time, uuid } from "drizzle-orm/pg-core";
import { courses } from "./courses.schema.js";
import { lecturers } from "./lecturers.schema.js";
import { venues } from "./venues.schema.js";
import { dayOfWeekEnum } from "./enums.js";

export const lectureSchedules = pgTable("lecture_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  lecturerId: uuid("lecturer_id")
    .references(() => lecturers.id, { onDelete: "cascade" })
    .notNull(),
  venueId: uuid("venue_id")
    .references(() => venues.id, { onDelete: "cascade" })
    .notNull(),
  dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});
