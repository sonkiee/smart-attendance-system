import express from "express";
import * as controller from "./student.controller.js";
import { methodNotAllowed } from "../../middlewares/methodNotAllowed.middleware.js";
import { shield } from "@/middlewares/auth.middleware.js";

const router = express.Router();

router.route("/profile").get(shield, controller.profile).all(methodNotAllowed);

export default router;
