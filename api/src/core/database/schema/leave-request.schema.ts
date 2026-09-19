import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { leaveTypes } from "./leave-types.schema.js";
import { users } from "./users.schema.js";

export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected"]);

export const leaveRequests = pgTable(
  "leave_requests",
  {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").notNull().unique().defaultRandom(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    leaveTypeId: integer("leave_type_id")
      .notNull()
      .references(() => leaveTypes.id, { onDelete: "restrict" }),

    startsAt: date("starts_at", { mode: "string" }).notNull(),
    endsAt: date("ends_at", { mode: "string" }).notNull(),
    workingDays: integer("working_days").notNull(),
    status: requestStatusEnum("status").notNull().default("pending"),

    reviewerId: integer("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    reviewNote: text("review_note"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("ck_leave_requests_date_range", sql`${t.endsAt} >= ${t.startsAt}`),
    index("idx_leave_requests_user_dates").on(t.userId, t.startsAt),
    index("idx_leave_requests_pending").on(t.startsAt).where(sql`status = 'pending'`),
    index("idx_leave_requests_approved_dates")
      .on(t.leaveTypeId, t.startsAt, t.endsAt)
      .where(sql`status = 'approved'`),
  ]
);

export type LeaveRequestRow = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequestRow = typeof leaveRequests.$inferInsert;
