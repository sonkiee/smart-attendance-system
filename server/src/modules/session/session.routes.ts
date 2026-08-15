import express from "express";
import * as controller from "./session.controller.js";
import { shield } from "../../middlewares/auth.middleware.js";
import { methodNotAllowed } from "../../middlewares/methodNotAllowed.middleware.js";

const router = express.Router();

// Get active sessions for a student
router.route("/active")
  .get(shield, controller.getActiveForStudent)
  .all(methodNotAllowed);

// Create a session
router.route("/")
  .post(shield, controller.create)
  .all(methodNotAllowed);

// Close a session
router.route("/:id/close")
  .post(shield, controller.closeSession)
  .all(methodNotAllowed);

// Toggle Course Rep delegation
router.route("/:id/toggle-rep-marking")
  .post(shield, controller.toggleRepMarking)
  .all(methodNotAllowed);

export default router;
