import { UUID } from "crypto";
import { db } from "../../db";
import {
  NewUser,
  users,
  students,
  lecturers,
  courses,
  venues,
  attendanceSessions,
  attendanceRecords,
} from "../../db/schema";
import { eq, desc, sql } from "drizzle-orm";

const create = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values({
      email: data.email.toLocaleLowerCase().trim(),
      passwordHash: data.passwordHash,
      role: data.role,
    })
    .returning();
  return user;
};

const findByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLocaleLowerCase().trim()))
    .limit(1);
  return user || null;
};

const findById = async (id: UUID) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
};

const update = async (id: string, data: Partial<typeof users.$inferInsert>) => {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser || null;
};

const getAllUsers = async () => {
  return await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      isActivated: users.isActivated,
      deviceId: users.deviceId,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
};

const getAdminStats = async () => {
  const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(students);
  const [lecturerCount] = await db.select({ count: sql<number>`count(*)` }).from(lecturers);
  const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
  const [venueCount] = await db.select({ count: sql<number>`count(*)` }).from(venues);
  const [activeSessionCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(attendanceSessions)
    .where(eq(attendanceSessions.status, "active"));

  const recentRecords = await db
    .select({
      id: attendanceRecords.id,
      status: attendanceRecords.status,
      markedAt: attendanceRecords.markedAt,
      studentName: sql<string>`concat(${students.firstName}, ' ', ${students.lastName})`,
      matricNumber: students.matricNumber,
      courseCode: courses.courseCode,
      courseTitle: courses.courseTitle,
      venueName: venues.name,
    })
    .from(attendanceRecords)
    .innerJoin(students, eq(attendanceRecords.studentId, students.id))
    .innerJoin(attendanceSessions, eq(attendanceRecords.sessionId, attendanceSessions.id))
    .innerJoin(courses, eq(attendanceSessions.courseId, courses.id))
    .leftJoin(venues, eq(attendanceSessions.venueId, venues.id))
    .orderBy(desc(attendanceRecords.markedAt))
    .limit(8);

  const activeSessionsList = await db
    .select({
      id: attendanceSessions.id,
      courseCode: courses.courseCode,
      courseTitle: courses.courseTitle,
      venueName: venues.name,
      status: attendanceSessions.status,
      attendanceCode: attendanceSessions.attendanceCode,
      startTime: attendanceSessions.startTime,
      endTime: attendanceSessions.endTime,
      sessionDate: attendanceSessions.sessionDate,
      allowRepMarking: attendanceSessions.allowRepMarking,
    })
    .from(attendanceSessions)
    .innerJoin(courses, eq(attendanceSessions.courseId, courses.id))
    .leftJoin(venues, eq(attendanceSessions.venueId, venues.id))
    .where(eq(attendanceSessions.status, "active"));

  return {
    totalStudents: Number(studentCount?.count || 0),
    totalLecturers: Number(lecturerCount?.count || 0),
    totalCourses: Number(courseCount?.count || 0),
    totalVenues: Number(venueCount?.count || 0),
    activeSessions: Number(activeSessionCount?.count || 0),
    activeSessionsList,
    recentActivity: recentRecords,
  };
};

export { create, findByEmail, findById, update, getAllUsers, getAdminStats };
