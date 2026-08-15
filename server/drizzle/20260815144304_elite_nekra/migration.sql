CREATE TABLE "course_reps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_rep_unique" UNIQUE("course_id","student_id")
);
--> statement-breakpoint
ALTER TABLE "attendance_sessions" DROP CONSTRAINT "attendance_sessions_schedule_id_lecture_schedules_id_fkey";--> statement-breakpoint
DROP TABLE "lecture_schedules";--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD COLUMN "course_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD COLUMN "lecturer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD COLUMN "venue_id" uuid;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD COLUMN "allow_rep_marking" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_sessions" DROP COLUMN "schedule_id";--> statement-breakpoint
ALTER TABLE "course_reps" ADD CONSTRAINT "course_reps_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "course_reps" ADD CONSTRAINT "course_reps_student_id_students_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_lecturer_id_lecturers_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_venue_id_venues_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE SET NULL;