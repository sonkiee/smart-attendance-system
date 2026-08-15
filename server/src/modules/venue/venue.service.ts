import { db } from "@/db";
import { venues, NewVenue } from "@/db/schema";
import { eq } from "drizzle-orm";

const create = async (data: NewVenue) => {
  const [venue] = await db
    .insert(venues)
    .values({
      name: data.name.trim(),
      latitude: data.latitude,
      longitude: data.longitude,
      radiusMeters: data.radiusMeters,
    })
    .returning();
  return venue;
};

const getAll = async () => {
  return await db.select().from(venues);
};

const getById = async (id: string) => {
  const [venue] = await db
    .select()
    .from(venues)
    .where(eq(venues.id, id))
    .limit(1);
  return venue || null;
};

export { create, getAll, getById };
