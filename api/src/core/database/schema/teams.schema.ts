import { pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  publicId: uuid("public_id").notNull().unique().defaultRandom(),

  name: varchar("name", { length: 100 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TeamRow = typeof teams.$inferSelect;
export type InsertTeamRow = typeof teams.$inferInsert;
