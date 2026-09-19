import { integer, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const leaveTypes = pgTable("leave_types", {
  id: serial("id").primaryKey(),
  publicId: uuid("public_id").notNull().unique().defaultRandom(),

  name: varchar("name", { length: 50 }).notNull().unique(),
  defaultAllowance: integer("default_allowance").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type LeaveTypeRow = typeof leaveTypes.$inferSelect;
export type InsertLeaveTypeRow = typeof leaveTypes.$inferInsert;
