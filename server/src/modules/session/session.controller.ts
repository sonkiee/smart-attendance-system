import { Request, Response } from "express";
import * as service from "./session.service";
import * as lecturerService from "../lecturer/lecturer.service";
import * as studentService from "../student/student.service";

const create = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can create sessions" });
    }

    const { courseId, venueId, durationMinutes, lateThresholdMinutes, allowRepMarking } = req.body;

    if (!courseId || !durationMinutes) {
      return res.status(400).json({ message: "courseId and durationMinutes are required" });
    }

    const lecturer = await lecturerService.findByUserId(user.id);
    if (!lecturer) {
      return res.status(403).json({ message: "Lecturer profile not found for user" });
    }

    // Generate 4-digit code
    const attendanceCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Time calculations
    const start = new Date();
    const end = new Date(start.getTime() + Number(durationMinutes) * 60 * 1000);
    const sessionDate = start.toISOString().split("T")[0];
    const startTime = start.toTimeString().split(" ")[0];
    const endTime = end.toTimeString().split(" ")[0];

    const session = await service.create({
      courseId,
      lecturerId: lecturer.id,
      venueId: venueId || null,
      sessionDate,
      startTime,
      endTime,
      attendanceCode,
      status: "active",
      allowRepMarking: allowRepMarking || false,
      lateThresholdMinutes: lateThresholdMinutes !== undefined ? Number(lateThresholdMinutes) : 15,
    });

    return res.status(201).json(session);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to create session", error: error.message });
  }
};

const getActiveForStudent = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Only students can view active sessions" });
    }

    const student = await studentService.findByUserId(user.id);
    if (!student) {
      return res.status(403).json({ message: "Student profile not found for user" });
    }

    const sessions = await service.getActiveSessionsForStudent(student.id);
    return res.status(200).json(sessions);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch active sessions", error: error.message });
  }
};

const closeSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can close sessions" });
    }

    const id = req.params.id as string;
    const session = await service.getById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const lecturer = await lecturerService.findByUserId(user.id);
    if (!lecturer || session.lecturerId !== lecturer.id) {
      return res.status(403).json({ message: "You are not authorized to close this session" });
    }

    const updated = await service.updateStatus(id, "completed");
    return res.status(200).json({ message: "Session closed and absent students marked", session: updated });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to close session", error: error.message });
  }
};

const toggleRepMarking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can modify delegation settings" });
    }

    const id = req.params.id as string;
    const { allowRepMarking } = req.body;

    if (allowRepMarking === undefined) {
      return res.status(400).json({ message: "allowRepMarking is required" });
    }

    const session = await service.getById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const lecturer = await lecturerService.findByUserId(user.id);
    if (!lecturer || session.lecturerId !== lecturer.id) {
      return res.status(403).json({ message: "You are not authorized to modify this session" });
    }

    const updated = await service.update(id, { allowRepMarking: !!allowRepMarking });
    return res.status(200).json({ message: "Rep marking setting updated", session: updated });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to toggle rep marking", error: error.message });
  }
};

export { create, getActiveForStudent, closeSession, toggleRepMarking };
