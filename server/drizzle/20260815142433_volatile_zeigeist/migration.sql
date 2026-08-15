CREATE TABLE "course_lecturers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_id" uuid NOT NULL,
	"lecturer_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_lecturer_unique" UNIQUE("course_id","lecturer_id")
);
--> statement-breakpoint
ALTER TABLE "course_lecturers" ADD CONSTRAINT "course_lecturers_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "course_lecturers" ADD CONSTRAINT "course_lecturers_lecturer_id_lecturers_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE;