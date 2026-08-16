import { Request, Response } from "express";
import * as studentService from "./student.service";

const profile = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const student = await studentService.findByUserId(userId as string);

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  return res.status(200).json(student);
};

export { profile };
