import { db } from "@/db";
import { courses, courseEnrollments, courseLecturers, students, lecturers, NewCourse, courseReps, attendanceSessions, attendanceRecords } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";

const create = async (data: NewCourse) => {
  const [course] = await db
    .insert(courses)
    .values({
      courseCode: data.courseCode.toUpperCase().trim(),
      courseTitle: data.courseTitle.trim(),
      unit: data.unit,
      department: data.department.trim(),
      level: data.level,
    })
    .returning();
  return course;
};

const getAll = async () => {
  return await db.select().from(courses);
};

const getById = async (id: string) => {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);
  return course || null;
};

const enrollStudentsByMatric = async (courseId: string, matricNumbers: string[]) => {
  if (matricNumbers.length === 0) {
    return { enrolledCount: 0, unregisteredMatricNumbers: [] };
  }

  const cleanMatrics = matricNumbers.map((m) => m.toLowerCase().trim());

  // Fetch all students who are registered in the db and match the matrics
  const foundStudents = await db
    .select({
      id: students.id,
      matricNumber: students.matricNumber,
    })
    .from(students)
    .where(inArray(students.matricNumber, cleanMatrics));

  const foundMatricsSet = new Set(foundStudents.map((s) => s.matricNumber.toLowerCase().trim()));

  // Identify matrics that do not exist in the db
  const unregisteredMatricNumbers = matricNumbers.filter(
    (m) => !foundMatricsSet.has(m.toLowerCase().trim())
  );

  if (foundStudents.length > 0) {
    const enrollments = foundStudents.map((s) => ({
      courseId,
      studentId: s.id,
    }));

    await db.insert(courseEnrollments).values(enrollments).onConflictDoNothing();
  }

  return {
    enrolledCount: foundStudents.length,
    unregisteredMatricNumbers,
  };
};

const assignLecturers = async (courseId: string, lecturerIds: string[]) => {
  return await db.transaction(async (tx) => {
    // Remove existing assignments
    await tx.delete(courseLecturers).where(eq(courseLecturers.courseId, courseId));

    // Insert new ones
    if (lecturerIds.length > 0) {
      const values = lecturerIds.map((lId) => ({
        courseId,
        lecturerId: lId,
      }));
      await tx.insert(courseLecturers).values(values).onConflictDoNothing();
    }
  });
};

const getCourseLecturers = async (courseId: string) => {
  return await db
    .select({
      id: lecturers.id,
      staffNumber: lecturers.staffNumber,
      firstName: lecturers.firstName,
      lastName: lecturers.lastName,
      department: lecturers.department,
    })
    .from(courseLecturers)
    .innerJoin(lecturers, eq(courseLecturers.lecturerId, lecturers.id))
    .where(eq(courseLecturers.courseId, courseId));
};

const getCourseStudents = async (courseId: string) => {
  return await db
    .select({
      id: students.id,
      matricNumber: students.matricNumber,
      firstName: students.firstName,
      lastName: students.lastName,
      department: students.department,
      level: students.level,
    })
    .from(courseEnrollments)
    .innerJoin(students, eq(courseEnrollments.studentId, students.id))
    .where(eq(courseEnrollments.courseId, courseId));
};

const addCourseRep = async (courseId: string, studentId: string) => {
  await db
    .insert(courseReps)
    .values({ courseId, studentId })
    .onConflictDoNothing();
};

const removeCourseRep = async (courseId: string, studentId: string) => {
  await db
    .delete(courseReps)
    .where(and(eq(courseReps.courseId, courseId), eq(courseReps.studentId, studentId)));
};

const getCourseReps = async (courseId: string) => {
  return await db
    .select({
      id: students.id,
      matricNumber: students.matricNumber,
      firstName: students.firstName,
      lastName: students.lastName,
      department: students.department,
    })
    .from(courseReps)
    .innerJoin(students, eq(courseReps.studentId, students.id))
    .where(eq(courseReps.courseId, courseId));
};

const getCourseAttendanceStats = async (courseId: string) => {
  // 1. Get all sessions for this course
  const sessions = await db
    .select({ id: attendanceSessions.id })
    .from(attendanceSessions)
    .where(eq(attendanceSessions.courseId, courseId));

  const totalSessions = sessions.length;

  // 2. Get all enrolled students
  const enrolled = await getCourseStudents(courseId);

  // 3. Get all present/late records for these sessions
  const records = await db
    .select({
      studentId: attendanceRecords.studentId,
      status: attendanceRecords.status,
    })
    .from(attendanceRecords)
    .innerJoin(attendanceSessions, eq(attendanceRecords.sessionId, attendanceSessions.id))
    .where(
      and(
        eq(attendanceSessions.courseId, courseId),
        inArray(attendanceRecords.status, ["present", "late"])
      )
    );

  // Count attendance per student
  const attendanceCountMap = new Map<string, number>();
  records.forEach((rec) => {
    const currentCount = attendanceCountMap.get(rec.studentId) || 0;
    attendanceCountMap.set(rec.studentId, currentCount + 1);
  });

  // 4. Build statistics list
  return enrolled.map((student) => {
    const attended = attendanceCountMap.get(student.id) || 0;
    const missed = totalSessions - attended;
    const rate = totalSessions > 0 ? (attended / totalSessions) * 100 : 100.0;
    const formattedRate = Number(rate.toFixed(1));

    return {
      studentId: student.id,
      matricNumber: student.matricNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      department: student.department,
      level: student.level,
      totalSessions,
      attended,
      missed,
      attendanceRate: formattedRate,
      isEligible: formattedRate >= 75.0, // The 75% rule!
    };
  });
};

export {
  create,
  getAll,
  getById,
  enrollStudentsByMatric,
  assignLecturers,
  getCourseLecturers,
  getCourseStudents,
  addCourseRep,
  removeCourseRep,
  getCourseReps,
  getCourseAttendanceStats,
};
