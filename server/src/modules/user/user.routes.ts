import express from "express";
import * as controller from "./user.controller.js";
import { shield } from "../../middlewares/auth.middleware.js";
import { methodNotAllowed } from "../../middlewares/methodNotAllowed.middleware.js";

const router = express.Router();

router.route("/:id/reset-device")
  .post(shield, controller.resetDevice)
  .all(methodNotAllowed);

export default router;
