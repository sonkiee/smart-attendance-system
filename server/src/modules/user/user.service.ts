import { UUID } from "crypto";
import { db } from "../../db";
import { NewUser, users } from "../../db/schema";
import { eq } from "drizzle-orm";

const create = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values({
      email: data.email.toLocaleLowerCase().trim(),
      passwordHash: data.passwordHash,
      role: data.role,
    })
    .returning();
  return user;
};

const findByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLocaleLowerCase().trim()))
    .limit(1);
  return user || null;
};

const findById = async (id: UUID) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
};

const update = async (id: string, data: Partial<typeof users.$inferInsert>) => {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser || null;
};

export { create, findByEmail, findById, update };
