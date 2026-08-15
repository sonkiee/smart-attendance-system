ALTER TYPE "attendance_status" ADD VALUE 'unverified';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "device_id" varchar(255);--> statement-breakpoint
ALTER TABLE "attendance_records" ADD COLUMN "ble_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD COLUMN "is_manual" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD COLUMN "device_id" varchar(255);--> statement-breakpoint
ALTER TABLE "attendance_records" ADD COLUMN "marked_by_id" uuid;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD COLUMN "late_threshold_minutes" integer DEFAULT 15 NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_marked_by_id_users_id_fkey" FOREIGN KEY ("marked_by_id") REFERENCES "users"("id") ON DELETE SET NULL;