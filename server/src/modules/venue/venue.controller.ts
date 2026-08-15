import { Request, Response } from "express";
import * as service from "./venue.service";

const create = async (req: Request, res: Response) => {
  try {
    const { name, latitude, longitude, radiusMeters } = req.body;

    if (!name || latitude === undefined || longitude === undefined || radiusMeters === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const venue = await service.create({
      name,
      latitude: Number(latitude),
      longitude: Number(longitude),
      radiusMeters: Number(radiusMeters),
    });

    return res.status(201).json(venue);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to create venue", error: error.message });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const venues = await service.getAll();
    return res.status(200).json(venues);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch venues", error: error.message });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const venue = await service.getById(id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    return res.status(200).json(venue);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch venue", error: error.message });
  }
};

export { create, getAll, getById };
