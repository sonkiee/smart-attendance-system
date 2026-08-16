import { db } from "@/db";
import {
  attendanceSessions,
  attendanceRecords,
  courseEnrollments,
  NewAttendanceSession,
  venues,
  courses,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

const create = async (data: NewAttendanceSession) => {
  const [session] = await db
    .insert(attendanceSessions)
    .values(data)
    .returning();
  return session;
};

const getAll = async () => {
  return await db
    .select({
      id: attendanceSessions.id,
      courseId: attendanceSessions.courseId,
      courseCode: courses.courseCode,
      courseTitle: courses.courseTitle,
      lecturerId: attendanceSessions.lecturerId,
      venueId: attendanceSessions.venueId,
      sessionDate: attendanceSessions.sessionDate,
      startTime: attendanceSessions.startTime,
      endTime: attendanceSessions.endTime,
      attendanceCode: attendanceSessions.attendanceCode,
      status: attendanceSessions.status,
      allowRepMarking: attendanceSessions.allowRepMarking,
      lateThresholdMinutes: attendanceSessions.lateThresholdMinutes,
      createdAt: attendanceSessions.createdAt,
      venueName: venues.name,
    })
    .from(attendanceSessions)
    .innerJoin(courses, eq(attendanceSessions.courseId, courses.id))
    .leftJoin(venues, eq(attendanceSessions.venueId, venues.id));
};

const getById = async (id: string) => {
  const [session] = await db
    .select({
      id: attendanceSessions.id,
      courseId: attendanceSessions.courseId,
      courseCode: courses.courseCode,
      courseTitle: courses.courseTitle,
      lecturerId: attendanceSessions.lecturerId,
      venueId: attendanceSessions.venueId,
      sessionDate: attendanceSessions.sessionDate,
      startTime: attendanceSessions.startTime,
      endTime: attendanceSessions.endTime,
      attendanceCode: attendanceSessions.attendanceCode,
      status: attendanceSessions.status,
      allowRepMarking: attendanceSessions.allowRepMarking,
      lateThresholdMinutes: attendanceSessions.lateThresholdMinutes,
      createdAt: attendanceSessions.createdAt,
      venueName: venues.name,
    })
    .from(attendanceSessions)
    .innerJoin(courses, eq(attendanceSessions.courseId, courses.id))
    .leftJoin(venues, eq(attendanceSessions.venueId, venues.id))
    .where(eq(attendanceSessions.id, id))
    .limit(1);
  return session || null;
};

const getActiveSessionsForStudent = async (studentId: string) => {
  // Join active sessions for courses where the student is enrolled
  return await db
    .select({
      id: attendanceSessions.id,
      courseId: attendanceSessions.courseId,
      courseCode: courses.courseCode,
      courseTitle: courses.courseTitle,
      lecturerId: attendanceSessions.lecturerId,
      venueId: attendanceSessions.venueId,
      sessionDate: attendanceSessions.sessionDate,
      startTime: attendanceSessions.startTime,
      endTime: attendanceSessions.endTime,
      status: attendanceSessions.status,
      allowRepMarking: attendanceSessions.allowRepMarking,
      lateThresholdMinutes: attendanceSessions.lateThresholdMinutes,
      venueName: venues.name,
    })
    .from(attendanceSessions)
    .innerJoin(
      courseEnrollments,
      and(
        eq(attendanceSessions.courseId, courseEnrollments.courseId),
        eq(courseEnrollments.studentId, studentId),
      ),
    )
    .innerJoin(courses, eq(attendanceSessions.courseId, courses.id))
    .leftJoin(venues, eq(attendanceSessions.venueId, venues.id))
    .where(eq(attendanceSessions.status, "active"));
};

const updateStatus = async (
  id: string,
  status: "active" | "completed" | "cancelled",
) => {
  return await db.transaction(async (tx) => {
    // 1. Update the session status
    const [updatedSession] = await tx
      .update(attendanceSessions)
      .set({ status })
      .where(eq(attendanceSessions.id, id))
      .returning();

    if (!updatedSession) return null;

    // 2. If completed, auto-mark absent students
    if (status === "completed") {
      // Get all enrolled students
      const enrolled = await tx
        .select({ studentId: courseEnrollments.studentId })
        .from(courseEnrollments)
        .where(eq(courseEnrollments.courseId, updatedSession.courseId));

      // Get students who already have attendance records
      const marked = await tx
        .select({ studentId: attendanceRecords.studentId })
        .from(attendanceRecords)
        .where(eq(attendanceRecords.sessionId, id));

      const markedSet = new Set(marked.map((m) => m.studentId));

      // Identify absent students
      const absentStudents = enrolled.filter(
        (e) => !markedSet.has(e.studentId),
      );

      if (absentStudents.length > 0) {
        const absentRecords = absentStudents.map((s) => ({
          sessionId: id,
          studentId: s.studentId,
          status: "absent" as const,
          locationVerified: false,
          codeVerified: false,
          bleVerified: false,
          isManual: false,
          markedAt: new Date(),
        }));

        await tx
          .insert(attendanceRecords)
          .values(absentRecords)
          .onConflictDoNothing();
      }
    }

    return updatedSession;
  });
};

const update = async (id: string, data: Partial<NewAttendanceSession>) => {
  const [updated] = await db
    .update(attendanceSessions)
    .set(data)
    .where(eq(attendanceSessions.id, id))
    .returning();
  return updated || null;
};

export {
  create,
  getAll,
  getById,
  getActiveSessionsForStudent,
  updateStatus,
  update,
};
