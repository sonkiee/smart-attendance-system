import { db } from "@/db";
import {
  attendanceSessions,
  attendanceRecords,
  courseEnrollments,
  courses,
  students,
  users,
  venues,
  courseReps,
} from "@/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { getDistanceMeters } from "@/utils/geo";
import * as userService from "../user/user.service";

const markSelf = async (data: {
  sessionId: string;
  studentId: string;
  latitude?: number;
  longitude?: number;
  bleVerified: boolean;
  deviceId: string;
  attendanceCode: string;
}) => {
  // 1. Fetch Session details with Venue
  const [session] = await db
    .select({
      id: attendanceSessions.id,
      courseId: attendanceSessions.courseId,
      attendanceCode: attendanceSessions.attendanceCode,
      status: attendanceSessions.status,
      startTime: attendanceSessions.startTime,
      lateThresholdMinutes: attendanceSessions.lateThresholdMinutes,
      venueLatitude: venues.latitude,
      venueLongitude: venues.longitude,
      venueRadius: venues.radiusMeters,
    })
    .from(attendanceSessions)
    .leftJoin(venues, eq(attendanceSessions.venueId, venues.id))
    .where(eq(attendanceSessions.id, data.sessionId))
    .limit(1);

  if (!session) {
    throw new Error("Attendance session not found");
  }

  if (session.status !== "active") {
    throw new Error("This attendance session is no longer active");
  }

  // 2. Verify Course Enrollment
  const [enrollment] = await db
    .select()
    .from(courseEnrollments)
    .where(
      and(
        eq(courseEnrollments.courseId, session.courseId),
        eq(courseEnrollments.studentId, data.studentId)
      )
    )
    .limit(1);

  if (!enrollment) {
    throw new Error("You are not enrolled in this course");
  }

  // 3. Verify and Tie Device ID
  const [studentProfile] = await db
    .select({ userId: students.userId })
    .from(students)
    .where(eq(students.id, data.studentId))
    .limit(1);

  if (!studentProfile) {
    throw new Error("Student profile not found");
  }

  const user = await userService.findById(studentProfile.userId as any);
  if (!user) {
    throw new Error("User account associated with student not found");
  }

  if (!user.deviceId) {
    // Register the device ID on the first login/attendance attempt
    await userService.update(user.id, { deviceId: data.deviceId });
  } else if (user.deviceId !== data.deviceId) {
    throw new Error("Device mismatch. This account is tied to another device.");
  }

  // 4. Verify Passcode
  const isCodeCorrect = session.attendanceCode === data.attendanceCode.trim();
  if (!isCodeCorrect) {
    throw new Error("Invalid attendance code");
  }

  // 5. Verify Proximity (Bluetooth BLE or GPS)
  let locationVerified = false;
  let distanceMeters: number | null = null;

  if (data.bleVerified) {
    locationVerified = true;
  } else if (data.latitude !== undefined && data.longitude !== undefined && session.venueLatitude !== null && session.venueLongitude !== null) {
    distanceMeters = getDistanceMeters(
      data.latitude,
      data.longitude,
      session.venueLatitude,
      session.venueLongitude
    );
    locationVerified = distanceMeters <= (session.venueRadius || 50);
  } else {
    throw new Error("GPS coordinates or Bluetooth verification is required");
  }

  // 6. Check if student is late or on-time
  let status: "present" | "late" | "unverified" = "present";

  if (!locationVerified) {
    status = "unverified";
  } else {
    const startHour = Number(session.startTime.split(":")[0]);
    const startMin = Number(session.startTime.split(":")[1]);
    const now = new Date();
    const startTimeToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      startHour,
      startMin,
      0
    );
    const lateLimitTime = new Date(startTimeToday.getTime() + session.lateThresholdMinutes * 60 * 1000);

    if (now > lateLimitTime) {
      status = "late";
    }
  }

  // 7. Upsert the attendance record
  const recordValues = {
    sessionId: data.sessionId,
    studentId: data.studentId,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    distanceMeters: distanceMeters,
    locationVerified,
    codeVerified: true,
    bleVerified: data.bleVerified,
    isManual: false,
    deviceId: data.deviceId,
    status,
    markedAt: new Date(),
  };

  const [record] = await db
    .insert(attendanceRecords)
    .values(recordValues)
    .onConflictDoUpdate({
      target: [attendanceRecords.sessionId, attendanceRecords.studentId],
      set: recordValues,
    })
    .returning();

  return record;
};

const markManual = async (data: {
  sessionId: string;
  studentId: string;
  status: "present" | "absent" | "late";
  markedById: string;
}) => {
  const recordValues = {
    sessionId: data.sessionId,
    studentId: data.studentId,
    locationVerified: true,
    codeVerified: true,
    bleVerified: false,
    isManual: true,
    markedById: data.markedById,
    status: data.status,
    markedAt: new Date(),
  };

  const [record] = await db
    .insert(attendanceRecords)
    .values(recordValues)
    .onConflictDoUpdate({
      target: [attendanceRecords.sessionId, attendanceRecords.studentId],
      set: recordValues,
    })
    .returning();

  return record;
};

const getHistoryForStudent = async (studentId: string) => {
  return await db
    .select({
      sessionId: attendanceSessions.id,
      sessionDate: attendanceSessions.sessionDate,
      startTime: attendanceSessions.startTime,
      endTime: attendanceSessions.endTime,
      courseCode: courses.courseCode,
      courseTitle: courses.courseTitle,
      status: sql`COALESCE(${attendanceRecords.status}, 'absent')`,
      isManual: attendanceRecords.isManual,
      markedAt: attendanceRecords.markedAt,
    })
    .from(courseEnrollments)
    .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
    .innerJoin(attendanceSessions, eq(courses.id, attendanceSessions.courseId))
    .leftJoin(
      attendanceRecords,
      and(
        eq(attendanceSessions.id, attendanceRecords.sessionId),
        eq(attendanceRecords.studentId, studentId)
      )
    )
    .where(eq(courseEnrollments.studentId, studentId));
};

const getHistoryForLecturer = async (lecturerId: string) => {
  // Returns all sessions created by the lecturer, with aggregate counts
  return await db
    .select({
      sessionId: attendanceSessions.id,
      sessionDate: attendanceSessions.sessionDate,
      startTime: attendanceSessions.startTime,
      endTime: attendanceSessions.endTime,
      courseCode: courses.courseCode,
      courseTitle: courses.courseTitle,
      allowRepMarking: attendanceSessions.allowRepMarking,
      status: attendanceSessions.status,
      presentCount: sql<number>`count(case when ${attendanceRecords.status} = 'present' then 1 end)::int`,
      lateCount: sql<number>`count(case when ${attendanceRecords.status} = 'late' then 1 end)::int`,
      unverifiedCount: sql<number>`count(case when ${attendanceRecords.status} = 'unverified' then 1 end)::int`,
      absentCount: sql<number>`count(case when ${attendanceRecords.status} = 'absent' or ${attendanceRecords.status} is null then 1 end)::int`,
    })
    .from(attendanceSessions)
    .innerJoin(courses, eq(attendanceSessions.courseId, courses.id))
    .leftJoin(attendanceRecords, eq(attendanceSessions.id, attendanceRecords.sessionId))
    .where(eq(attendanceSessions.lecturerId, lecturerId))
    .groupBy(attendanceSessions.id, courses.id);
};

const getUnverifiedRecords = async (sessionId: string) => {
  return await db
    .select({
      id: attendanceRecords.id,
      studentId: attendanceRecords.studentId,
      status: attendanceRecords.status,
      distanceMeters: attendanceRecords.distanceMeters,
      markedAt: attendanceRecords.markedAt,
      matricNumber: students.matricNumber,
      firstName: students.firstName,
      lastName: students.lastName,
    })
    .from(attendanceRecords)
    .innerJoin(students, eq(attendanceRecords.studentId, students.id))
    .where(
      and(
        eq(attendanceRecords.sessionId, sessionId),
        eq(attendanceRecords.status, "unverified")
      )
    );
};

const verifyRecords = async (sessionId: string, studentIds: string[], status: "present" | "late", verifiedById: string) => {
  return await db
    .update(attendanceRecords)
    .set({
      status,
      locationVerified: true,
      isManual: true,
      markedById: verifiedById,
      markedAt: new Date(),
    })
    .where(
      and(
        eq(attendanceRecords.sessionId, sessionId),
        inArray(attendanceRecords.studentId, studentIds)
      )
    )
    .returning();
};

export {
  markSelf,
  markManual,
  getHistoryForStudent,
  getHistoryForLecturer,
  getUnverifiedRecords,
  verifyRecords,
};
