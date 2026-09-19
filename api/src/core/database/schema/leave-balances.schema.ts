import { sql } from "drizzle-orm";
import { check, integer, pgTable, serial, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { leaveTypes } from "./leave-types.schema.js";
import { users } from "./users.schema.js";

export const leaveBalances = pgTable(
  "leave_balances",
  {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").notNull().unique().defaultRandom(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    leaveTypeId: integer("leave_type_id")
      .notNull()
      .references(() => leaveTypes.id, { onDelete: "restrict" }),
    year: integer("year").notNull(),

    allowanceDays: integer("allowance_days").notNull(),
    usedDays: integer("used_days").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("uq_leave_balances_user_type_year").on(t.userId, t.leaveTypeId, t.year),
    check("ck_leave_balances_year", sql`${t.year} >= 2000`),
    check("ck_leave_balances_allowance", sql`${t.allowanceDays} >= 0`),
    check("ck_leave_balances_used", sql`${t.usedDays} >= 0`),
  ]
);

export type LeaveBalanceRow = typeof leaveBalances.$inferSelect;
export type InsertLeaveBalanceRow = typeof leaveBalances.$inferInsert;
