import { Request, Response } from "express";
import * as service from "./lecturer.service";

const create = async (req: Request, res: Response) => {
  try {
    const { email, password, staffNumber, firstName, lastName, department } = req.body;

    if (!email || !staffNumber || !firstName || !lastName || !department) {
      return res.status(400).json({ message: "All fields except password are required" });
    }

    const result = await service.create({
      email,
      password,
      staffNumber,
      firstName,
      lastName,
      department,
    });

    return res.status(201).json(result);
  } catch (error: any) {
    if (error.code === "23505") { // Postgres unique violation
      return res.status(409).json({ message: "Email or Staff Number already exists" });
    }
    return res.status(500).json({ message: "Failed to create lecturer", error: error.message });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const lecturers = await service.getAll();
    return res.status(200).json(lecturers);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch lecturers", error: error.message });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const lecturer = await service.getById(id);

    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    return res.status(200).json(lecturer);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch lecturer", error: error.message });
  }
};

export { create, getAll, getById };
