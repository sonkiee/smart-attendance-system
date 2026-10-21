import express from "express";
import * as controller from "./lecturer.controller.js";
import { shield } from "../../middlewares/auth.middleware.js";
import { methodNotAllowed } from "../../middlewares/methodNotAllowed.middleware.js";

const router = express.Router();

router.route("/profile")
  .get(shield, controller.profile)
  .all(methodNotAllowed);

router.route("/")
  .post(controller.create)
  .get(controller.getAll)
  .all(methodNotAllowed);

router.route("/:id")
  .get(controller.getById)
  .all(methodNotAllowed);

export default router;
