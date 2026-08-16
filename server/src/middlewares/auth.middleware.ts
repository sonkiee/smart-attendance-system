import { NextFunction, Request, Response } from "express";
import { jwt } from "../utils/jwt";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const getToken = (request: Request): string | null => {
  return request.headers.authorization?.startsWith("Bearer ")
    ? request.headers.authorization?.split(" ")[1]
    : null;
};

export const shield = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const token = getToken(request);

  if (!token) {
    return response
      .status(401)
      .json({ message: "Token not found in authorization header" });
  }

  try {
    const decoded = jwt.verify(token) as {
      id: string;
      email: string;
      role: string;
    };
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    request.user = user;
    return next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid token" });
  }
};
