// src/features/leave-types/repository/leave-types.repository.ts

import { eq } from "drizzle-orm";
import { db } from "../../../core/database/db.js";
import { type LeaveTypeRow, leaveTypes } from "../../../core/database/schema/index.js";

type TxClient = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | TxClient;

/**
 * Find a leave type by its ID.
 * @param leaveTypeId The ID of the leave type to find.
 * @param client The database client to use.
 * @returns The leave type if found, otherwise null.
 */
export async function findLeaveTypeById(
  leaveTypeId: number,
  client: DbClient = db
): Promise<LeaveTypeRow | null> {
  const rows = await client
    .select()
    .from(leaveTypes)
    .where(eq(leaveTypes.id, leaveTypeId))
    .limit(1);

  return rows[0] ?? null;
}
