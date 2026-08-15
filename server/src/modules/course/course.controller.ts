import { Request, Response } from "express";
import * as service from "./course.service";
import { db } from "@/db";
import { attendanceSessions, attendanceRecords } from "@/db/schema";
import { eq } from "drizzle-orm";

const create = async (req: Request, res: Response) => {
  try {
    const { courseCode, courseTitle, unit, department, level } = req.body;

    if (!courseCode || !courseTitle || !unit || !department || !level) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await service.create({
      courseCode,
      courseTitle,
      unit: Number(unit),
      department,
      level: Number(level),
    });

    return res.status(201).json(course);
  } catch (error: any) {
    if (error.code === "23505") { // Postgres unique violation code
      return res.status(409).json({ message: "Course code already exists" });
    }
    return res.status(500).json({ message: "Failed to create course", error: error.message });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const courses = await service.getAll();
    return res.status(200).json(courses);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const course = await service.getById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch course", error: error.message });
  }
};

const importStudents = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id as string;
    const { matricNumbers } = req.body;

    if (!Array.isArray(matricNumbers)) {
      return res.status(400).json({ message: "matricNumbers must be an array of strings" });
    }

    const course = await service.getById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const result = await service.enrollStudentsByMatric(courseId, matricNumbers);
    return res.status(200).json({
      message: "Import processing finished",
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to import students", error: error.message });
  }
};

const assignLecturers = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id as string;
    const { lecturerIds } = req.body;

    if (!Array.isArray(lecturerIds)) {
      return res.status(400).json({ message: "lecturerIds must be an array of strings" });
    }

    const course = await service.getById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await service.assignLecturers(courseId, lecturerIds);
    return res.status(200).json({ message: "Lecturers assigned to course successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to assign lecturers", error: error.message });
  }
};

const getCourseLecturers = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id as string;
    const lecturersList = await service.getCourseLecturers(courseId);
    return res.status(200).json(lecturersList);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch course lecturers", error: error.message });
  }
};

const getCourseStudents = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id as string;
    const studentsList = await service.getCourseStudents(courseId);
    return res.status(200).json(studentsList);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch enrolled students", error: error.message });
  }
};

const addCourseRep = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can assign course reps" });
    }

    const courseId = req.params.id as string;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    const course = await service.getById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await service.addCourseRep(courseId, studentId);
    return res.status(200).json({ message: "Student promoted to Course Rep successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to add course rep", error: error.message });
  }
};

const removeCourseRep = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can remove course reps" });
    }

    const courseId = req.params.id as string;
    const studentId = req.params.studentId as string;

    const course = await service.getById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await service.removeCourseRep(courseId, studentId);
    return res.status(200).json({ message: "Student demoted from Course Rep successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to remove course rep", error: error.message });
  }
};

const getCourseReps = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id as string;
    const reps = await service.getCourseReps(courseId);
    return res.status(200).json(reps);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch course reps", error: error.message });
  }
};

const exportAttendance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can export course attendance" });
    }

    const courseId = req.params.id as string;
    const course = await service.getById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const sessions = await db
      .select()
      .from(attendanceSessions)
      .where(eq(attendanceSessions.courseId, courseId))
      .orderBy(attendanceSessions.sessionDate);

    const enrolledStudents = await service.getCourseStudents(courseId);

    const records = await db
      .select({
        studentId: attendanceRecords.studentId,
        sessionId: attendanceRecords.sessionId,
        status: attendanceRecords.status,
      })
      .from(attendanceRecords)
      .innerJoin(attendanceSessions, eq(attendanceRecords.sessionId, attendanceSessions.id))
      .where(eq(attendanceSessions.courseId, courseId));

    const recordMap = new Map<string, string>();
    records.forEach((r) => {
      recordMap.set(`${r.studentId}-${r.sessionId}`, r.status);
    });

    const headers = [
      "Matric Number",
      "First Name",
      "Last Name",
      "Department",
      "Level",
      ...sessions.map((s) => `${s.sessionDate} (${s.startTime})`),
      "Attendance Rate (%)",
    ];

    const csvRows = [headers.join(",")];

    enrolledStudents.forEach((student) => {
      let attendedCount = 0;
      const rowData = [
        student.matricNumber,
        student.firstName,
        student.lastName,
        student.department,
        student.level.toString(),
      ];

      sessions.forEach((session) => {
        const status = recordMap.get(`${student.id}-${session.id}`) || "absent";
        if (status === "present" || status === "late") {
          attendedCount++;
        }
        rowData.push(status);
      });

      const rate = sessions.length > 0 ? ((attendedCount / sessions.length) * 100).toFixed(1) : "0.0";
      rowData.push(`${rate}%`);
      csvRows.push(rowData.map((val) => `"${val}"`).join(","));
    });

    const csvString = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="attendance_${course.courseCode.replace(/\s+/g, "_")}.csv"`);
    return res.status(200).send(csvString);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to export attendance", error: error.message });
  }
};

const getCourseStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can view course attendance statistics" });
    }

    const courseId = req.params.id as string;
    const course = await service.getById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const stats = await service.getCourseAttendanceStats(courseId);
    return res.status(200).json(stats);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch course statistics", error: error.message });
  }
};

export {
  create,
  getAll,
  getById,
  importStudents,
  assignLecturers,
  getCourseLecturers,
  getCourseStudents,
  addCourseRep,
  removeCourseRep,
  getCourseReps,
  exportAttendance,
  getCourseStats,
};
