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
  return db.select().from(users).where(eq(users.email, email)).limit(1);
};

const findById = async (id: UUID) => {
  return db.select().from(users).where(eq(users.id, id)).limit(1);
};
