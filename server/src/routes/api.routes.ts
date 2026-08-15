import express from "express";
import userAuth from "@/modules/user/user.routes";
import roleAuth from "@/modules/auth/auth.routes";
import courseRoutes from "@/modules/course/course.routes";
import lecturerRoutes from "@/modules/lecturer/lecturer.routes";
import venueRoutes from "@/modules/venue/venue.routes";
import sessionRoutes from "@/modules/session/session.routes";
import attendanceRoutes from "@/modules/attendance/attendance.routes";
import { authLimiter } from "@/config/limiter.js";

const router = express.Router();

router.use("/auth", authLimiter);
router.use("/auth", userAuth);
router.use("/auth", roleAuth);
router.use("/courses", courseRoutes);
router.use("/lecturers", lecturerRoutes);
router.use("/venues", venueRoutes);
router.use("/sessions", sessionRoutes);
router.use("/attendance", attendanceRoutes);

export default router;
