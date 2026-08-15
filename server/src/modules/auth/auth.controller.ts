import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { jwt } from "@/utils/jwt";
import * as studentService from "../student/student.service";
import * as userService from "../user/user.service";
import * as lecturerService from "../lecturer/lecturer.service";

const signin = async (req: Request, res: Response) => {
  const { matricNumber, password } = req.body;
  const result = await studentService.findByMatric(matricNumber);

  if (!result) {
    return res
      .status(401)
      .json({ message: "Invalid matric number or password" });
  }

  const { student, user } = result;

  if (!user.isActivated) {
    return res
      .status(403)
      .json({ message: "Account not activated. Please activate your account first." });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ message: "Invalid matric number or password" });
  }

  const token = jwt.sign(user);

  return res.status(200).json({ token });
};

const activate = async (req: Request, res: Response) => {
  const { matricNumber, password } = req.body;

  if (!matricNumber || !password) {
    return res
      .status(400)
      .json({ message: "Matric number and password are required" });
  }

  const result = await studentService.findByMatric(matricNumber);

  if (!result) {
    return res
      .status(404)
      .json({ message: "Student not found with the provided matric number" });
  }

  const { student, user } = result;

  if (user.isActivated) {
    return res
      .status(400)
      .json({ message: "Account is already activated. Please sign in." });
  }

  // Hash the new password
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  // Update user in db
  const updatedUser = await userService.update(user.id, {
    passwordHash,
    isActivated: true,
  });

  if (!updatedUser) {
    return res
      .status(500)
      .json({ message: "Failed to activate account" });
  }

  // Sign token for immediate login
  const token = jwt.sign(updatedUser);

  return res.status(200).json({
    message: "Account activated successfully",
    token,
  });
};

const lecturerSignin = async (req: Request, res: Response) => {
  const { staffNumber, password } = req.body;

  if (!staffNumber || !password) {
    return res
      .status(400)
      .json({ message: "Staff number and password are required" });
  }

  const result = await lecturerService.findByStaffNumber(staffNumber);

  if (!result) {
    return res
      .status(401)
      .json({ message: "Invalid staff number or password" });
  }

  const { lecturer, user } = result;

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ message: "Invalid staff number or password" });
  }

  const token = jwt.sign(user);

  return res.status(200).json({ token });
};

export { signin, activate, lecturerSignin };
