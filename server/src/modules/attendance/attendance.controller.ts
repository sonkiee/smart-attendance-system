import { Request, Response } from "express";
import * as service from "./attendance.service";
import * as studentService from "../student/student.service";
import * as lecturerService from "../lecturer/lecturer.service";
import * as sessionService from "../session/session.service";
import { db } from "@/db";
import { courseReps } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const markSelf = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Only students can self-mark attendance" });
    }

    const student = await studentService.findByUserId(user.id);
    if (!student) {
      return res.status(403).json({ message: "Student profile not found for user" });
    }

    const { sessionId, latitude, longitude, bleVerified, deviceId, attendanceCode } = req.body;

    if (!sessionId || !deviceId || !attendanceCode) {
      return res.status(400).json({ message: "sessionId, deviceId, and attendanceCode are required" });
    }

    const record = await service.markSelf({
      sessionId,
      studentId: student.student.id,
      latitude: latitude !== undefined ? Number(latitude) : undefined,
      longitude: longitude !== undefined ? Number(longitude) : undefined,
      bleVerified: !!bleVerified,
      deviceId,
      attendanceCode,
    });

    return res.status(200).json({
      message: "Attendance marked successfully",
      status: record.status,
      record,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const markManual = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const sessionId = req.params.sessionId as string;
    const { studentId, status } = req.body;

    if (!studentId || !status) {
      return res.status(400).json({ message: "studentId and status are required" });
    }

    const session = await sessionService.getById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Authorization checks
    if (user.role === "lecturer") {
      const lecturer = await lecturerService.findByUserId(user.id);
      if (!lecturer || session.lecturerId !== lecturer.id) {
        return res.status(403).json({ message: "You are not authorized to mark attendance for this session" });
      }
    } else if (user.role === "student") {
      // Check if session allows Course Reps to mark
      if (!session.allowRepMarking) {
        return res.status(403).json({ message: "Lecturer has not authorized Course Reps to take attendance for this session" });
      }

      const repStudent = await studentService.findByUserId(user.id);
      if (!repStudent) {
        return res.status(403).json({ message: "Student profile not found" });
      }

      // Check if they are registered as Course Rep for this course
      const [repRecord] = await db
        .select()
        .from(courseReps)
        .where(
          and(
            eq(courseReps.courseId, session.courseId),
            eq(courseReps.studentId, repStudent.student.id)
          )
        )
        .limit(1);

      if (!repRecord) {
        return res.status(403).json({ message: "You are not registered as a Course Rep for this course" });
      }
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const record = await service.markManual({
      sessionId,
      studentId,
      status,
      markedById: user.id,
    });

    return res.status(200).json({
      message: "Attendance marked manually",
      record,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to mark attendance manually", error: error.message });
  }
};

const getHistory = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role === "student") {
      const student = await studentService.findByUserId(user.id);
      if (!student) {
        return res.status(403).json({ message: "Student profile not found" });
      }
      const history = await service.getHistoryForStudent(student.student.id);
      return res.status(200).json(history);
    } else if (user.role === "lecturer") {
      const lecturer = await lecturerService.findByUserId(user.id);
      if (!lecturer) {
        return res.status(403).json({ message: "Lecturer profile not found" });
      }
      const history = await service.getHistoryForLecturer(lecturer.id);
      return res.status(200).json(history);
    } else {
      return res.status(403).json({ message: "Unsupported role" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch attendance history", error: error.message });
  }
};

const getUnverified = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can view unverified records" });
    }

    const sessionId = req.params.sessionId as string;
    const session = await sessionService.getById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const lecturer = await lecturerService.findByUserId(user.id);
    if (!lecturer || session.lecturerId !== lecturer.id) {
      return res.status(403).json({ message: "You are not authorized to view unverified records for this session" });
    }

    const unverifiedList = await service.getUnverifiedRecords(sessionId);
    return res.status(200).json(unverifiedList);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch unverified records", error: error.message });
  }
};

const verifyUnverified = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can verify attendance records" });
    }

    const sessionId = req.params.sessionId as string;
    const { studentIds, status } = req.body;

    if (!Array.isArray(studentIds) || !status) {
      return res.status(400).json({ message: "studentIds (array) and status are required" });
    }

    if (status !== "present" && status !== "late") {
      return res.status(400).json({ message: "Status must be 'present' or 'late'" });
    }

    const session = await sessionService.getById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const lecturer = await lecturerService.findByUserId(user.id);
    if (!lecturer || session.lecturerId !== lecturer.id) {
      return res.status(403).json({ message: "You are not authorized to verify records for this session" });
    }

    const updated = await service.verifyRecords(sessionId, studentIds, status, user.id);
    return res.status(200).json({ message: "Records verified successfully", count: updated.length });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to verify records", error: error.message });
  }
};

export { markSelf, markManual, getHistory, getUnverified, verifyUnverified };
