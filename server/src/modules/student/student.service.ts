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
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1);
  return student || null;
};

export { findByMatric, findByUserId };
