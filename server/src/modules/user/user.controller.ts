import { Request, Response } from "express";
import * as service from "./user.service";

const resetDevice = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || (user.role !== "lecturer" && user.role !== "admin")) {
      return res.status(403).json({ message: "Only lecturers or admins can reset device IDs" });
    }

    const id = req.params.id as string;
    const targetUser = await service.findById(id as any);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await service.update(id, { deviceId: null });

    return res.status(200).json({ message: "Device ID reset successfully. User can now link a new device." });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to reset device ID", error: error.message });
  }
};

export { resetDevice };
