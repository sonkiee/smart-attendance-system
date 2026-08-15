import express from "express";
import * as controller from "./auth.controller.js";
import { methodNotAllowed } from "../../middlewares/methodNotAllowed.middleware.js";

const router = express.Router();

// Student Auth Routes
router.route("/student/signin").post(controller.signin).all(methodNotAllowed);
router.route("/student/activate").post(controller.activate).all(methodNotAllowed);

// Lecturer Auth Routes
router.route("/lecturer/signin").post(controller.lecturerSignin).all(methodNotAllowed);

export default router;
