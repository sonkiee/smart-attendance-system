import { db } from "@/db";
import { students, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const findByMatric = async (matricNumber: string) => {
  const result = await db
    .select({
      student: students,
      user: users,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(students.matricNumber, matricNumber.toLocaleLowerCase().trim()))
    .limit(1);

  return result[0] || null;
};

const findByUserId = async (userId: string) => {
  const result = await db
    .select({
      student: students,
      user: users,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(students.userId, userId))
    .limit(1);

  return result[0] || null;
};

const getAll = async () => {
  return await db
    .select({
      id: students.id,
      userId: students.userId,
      matricNumber: students.matricNumber,
      firstName: students.firstName,
      lastName: students.lastName,
      department: students.department,
      level: students.level,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      isActivated: users.isActivated,
      deviceId: users.deviceId,
      createdAt: users.createdAt,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id));
};

export { findByMatric, findByUserId, getAll };
