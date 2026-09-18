import {
  boolean,
  inet,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const authSessions = pgTable("auth_sessions", {
  id: serial("id").primaryKey(),
  publicId: uuid("public_id").notNull().unique().defaultRandom(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  refreshTokenHash: text("refresh_token_hash").notNull().unique(),
  ipAddress: inet("ip_address"),
  userAgent: varchar("user_agent", { length: 512 }),

  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  isRevoked: boolean("is_revoked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SessionRow = typeof authSessions.$inferSelect;
export type InsertSessionRow = typeof authSessions.$inferInsert;
