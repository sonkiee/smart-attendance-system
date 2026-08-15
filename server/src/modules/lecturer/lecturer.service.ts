import { db } from "@/db";
import { lecturers, users, NewLecturer } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const create = async (
  data: Omit<NewLecturer, "userId"> & { email: string; password?: string }
) => {
  return await db.transaction(async (tx) => {
    const defaultPassword = data.password || "Lecturer123!";
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(defaultPassword, salt);

    const [user] = await tx
      .insert(users)
      .values({
        email: data.email.toLocaleLowerCase().trim(),
        passwordHash,
        role: "lecturer",
        isActivated: data.password ? true : false,
      })
      .returning();

    const [lecturer] = await tx
      .insert(lecturers)
      .values({
        userId: user.id,
        staffNumber: data.staffNumber.toUpperCase().trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        department: data.department.trim(),
      })
      .returning();

    return { lecturer, user };
  });
};

const getAll = async () => {
  return await db
    .select({
      id: lecturers.id,
      userId: lecturers.userId,
      staffNumber: lecturers.staffNumber,
      firstName: lecturers.firstName,
      lastName: lecturers.lastName,
      department: lecturers.department,
      email: users.email,
      isActive: users.isActive,
      isActivated: users.isActivated,
    })
    .from(lecturers)
    .innerJoin(users, eq(lecturers.userId, users.id));
};

const getById = async (id: string) => {
  const [lecturer] = await db
    .select({
      id: lecturers.id,
      userId: lecturers.userId,
      staffNumber: lecturers.staffNumber,
      firstName: lecturers.firstName,
      lastName: lecturers.lastName,
      department: lecturers.department,
      email: users.email,
      isActive: users.isActive,
      isActivated: users.isActivated,
    })
    .from(lecturers)
    .innerJoin(users, eq(lecturers.userId, users.id))
    .where(eq(lecturers.id, id))
    .limit(1);
  return lecturer || null;
};

const findByStaffNumber = async (staffNumber: string) => {
  const result = await db
    .select({
      lecturer: lecturers,
      user: users,
    })
    .from(lecturers)
    .innerJoin(users, eq(lecturers.userId, users.id))
    .where(eq(lecturers.staffNumber, staffNumber.toUpperCase().trim()))
    .limit(1);

  return result[0] || null;
};

const findByUserId = async (userId: string) => {
  const [lecturer] = await db
    .select()
    .from(lecturers)
    .where(eq(lecturers.userId, userId))
    .limit(1);
  return lecturer || null;
};

export { create, getAll, getById, findByStaffNumber, findByUserId };
