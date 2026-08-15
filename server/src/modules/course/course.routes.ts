import express from "express";
import * as controller from "./course.controller.js";
import { methodNotAllowed } from "../../middlewares/methodNotAllowed.middleware.js";

import { shield } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/")
  .post(shield, controller.create)
  .get(shield, controller.getAll)
  .all(methodNotAllowed);

router.route("/:id")
  .get(shield, controller.getById)
  .all(methodNotAllowed);

router.route("/:id/students/import")
  .post(shield, controller.importStudents)
  .all(methodNotAllowed);

router.route("/:id/students")
  .get(shield, controller.getCourseStudents)
  .all(methodNotAllowed);

router.route("/:id/lecturers")
  .post(shield, controller.assignLecturers)
  .get(shield, controller.getCourseLecturers)
  .all(methodNotAllowed);

// Course Rep promotion and retrieval
router.route("/:id/reps")
  .post(shield, controller.addCourseRep)
  .get(shield, controller.getCourseReps)
  .all(methodNotAllowed);

router.route("/:id/reps/:studentId")
  .delete(shield, controller.removeCourseRep)
  .all(methodNotAllowed);

// CSV Attendance Export
router.route("/:id/export")
  .get(shield, controller.exportAttendance)
  .all(methodNotAllowed);

// Course Attendance Stats (75% Rule check)
router.route("/:id/stats")
  .get(shield, controller.getCourseStats)
  .all(methodNotAllowed);

export default router;
