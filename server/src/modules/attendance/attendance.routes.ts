import express from "express";
import * as controller from "./attendance.controller.js";
import { shield } from "../../middlewares/auth.middleware.js";
import { methodNotAllowed } from "../../middlewares/methodNotAllowed.middleware.js";

const router = express.Router();

// Self-marking endpoint (Student)
router.route("/mark")
  .post(shield, controller.markSelf)
  .all(methodNotAllowed);

// Manual attendance marking (Lecturer or Course Rep)
router.route("/sessions/:sessionId/mark-manual")
  .post(shield, controller.markManual)
  .all(methodNotAllowed);

// Unverified attendance queue and verification (Lecturer)
router.route("/sessions/:sessionId/unverified")
  .get(shield, controller.getUnverified)
  .all(methodNotAllowed);

router.route("/sessions/:sessionId/verify")
  .post(shield, controller.verifyUnverified)
  .all(methodNotAllowed);

// History logs (Student or Lecturer)
router.route("/history")
  .get(shield, controller.getHistory)
  .all(methodNotAllowed);

export default router;
