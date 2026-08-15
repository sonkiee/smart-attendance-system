import { doublePrecision, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const venues = pgTable("venues", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  radiusMeters: doublePrecision("radius_meters").notNull(),
});

export type Venue = InferSelectModel<typeof venues>;
export type NewVenue = InferInsertModel<typeof venues>;
