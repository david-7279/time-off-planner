import { eq } from "drizzle-orm";
import { db } from "../../../core/database/db.js";
import {
  authSessions,
  type InsertSessionRow,
  type InsertUserRow,
  type SessionRow,
  type UserRow,
  users,
} from "../../../core/database/schema/index.js";

export async function createUser(data: InsertUserRow): Promise<UserRow> {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function findUserByPublicId(publicId: string): Promise<UserRow | null> {
  const result = await db.select().from(users).where(eq(users.publicId, publicId)).limit(1);
  return result[0] ?? null;
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] ?? null;
}

export async function createSession(data: InsertSessionRow): Promise<SessionRow> {
  const result = await db.insert(authSessions).values(data).returning();

  return result[0];
}
