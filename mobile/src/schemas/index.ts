import { z } from "zod";

export const studentSigninSchema = z.object({
  matricNumber: z
    .string({ message: "Matriculation number is required" })
    .min(1, { message: "Matriculation number is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const lecturerSigninSchema = z.object({
  staffNumber: z
    .string({ message: "Staff number is required" })
    .min(1, { message: "Staff number is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const newSessionSchema = z.object({
  courseId: z.string().min(1, { message: "Course is required" }),
  venueId: z.string().min(1, { message: "Venue is required" }),
  durationMinutes: z
    .number()
    .min(1, { message: "Duration must be at least 1 minute" }),
  lateThresholdMinutes: z
    .number()
    .min(0, { message: "Late threshold cannot be negative" }),
  allowRepMark: z.boolean({ message: "Allow re-marking is required" }),
});

export type StudentSigninSchema = z.infer<typeof studentSigninSchema>;
export type LecturerSigninSchema = z.infer<typeof lecturerSigninSchema>;
export type NewSessionSchema = z.infer<typeof newSessionSchema>;
