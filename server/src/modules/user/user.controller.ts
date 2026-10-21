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

const getAll = async (req: Request, res: Response) => {
  try {
    const allUsers = await service.getAllUsers();
    return res.status(200).json(allUsers);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

const toggleStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const targetUser = await service.findById(id as any);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updated = await service.update(id, { isActive: !targetUser.isActive });
    return res.status(200).json({
      message: `User account ${updated?.isActive ? "activated" : "deactivated"} successfully`,
      user: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to toggle user status", error: error.message });
  }
};

const updateRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;
    if (!role || !["student", "lecturer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const updated = await service.update(id, { role: role as any });
    return res.status(200).json({ message: "User role updated successfully", user: updated });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to update role", error: error.message });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await service.getAdminStats();
    return res.status(200).json(stats);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch admin stats", error: error.message });
  }
};

export { resetDevice, getAll, toggleStatus, updateRole, getStats };
