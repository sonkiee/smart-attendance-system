import { doublePrecision, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const venues = pgTable("venues", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  radiusMeters: doublePrecision("radius_meters").notNull(),
});
