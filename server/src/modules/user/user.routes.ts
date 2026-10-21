import express from "express";
import * as controller from "./user.controller.js";
import { shield } from "../../middlewares/auth.middleware.js";
import { methodNotAllowed } from "../../middlewares/methodNotAllowed.middleware.js";

const router = express.Router();

router.route("/")
  .get(controller.getAll)
  .all(methodNotAllowed);

router.route("/stats")
  .get(controller.getStats)
  .all(methodNotAllowed);

router.route("/:id/reset-device")
  .post(shield, controller.resetDevice)
  .all(methodNotAllowed);

router.route("/:id/toggle-status")
  .patch(controller.toggleStatus)
  .all(methodNotAllowed);

router.route("/:id/role")
  .patch(controller.updateRole)
  .all(methodNotAllowed);

export default router;
