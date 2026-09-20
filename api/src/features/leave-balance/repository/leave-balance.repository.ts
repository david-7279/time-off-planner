// src/features/leave-balance/repository/leave-balance.repository.ts

import { and, eq } from "drizzle-orm";
import { db } from "../../../core/database/db.js";
import { type LeaveBalanceRow, leaveBalances } from "../../../core/database/schema/index.js";

type TxClient = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | TxClient;

/**
 * Find a balance by user ID.
 * @param userId The ID of the user to find.
 * @param leaveTypeId The ID of the leave type to find.
 * @param year The year to find.
 * @param client The database client to use.
 * @returns The balance if found, otherwise null.
 */
export async function findBalance(
  userId: number,
  leaveTypeId: number,
  year: number,
  client: DbClient = db
): Promise<LeaveBalanceRow | null> {
  const rows = await client
    .select()
    .from(leaveBalances)
    .where(
      and(
        eq(leaveBalances.userId, userId),
        eq(leaveBalances.leaveTypeId, leaveTypeId),
        eq(leaveBalances.year, year)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}
