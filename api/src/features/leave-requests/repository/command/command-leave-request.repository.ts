// src/features/leave-requests/repository/command/command-leave-request.repository.ts

import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../../core/database/db.js";
import { leaveBalances, leaveRequests } from "../../../../core/database/schema/index.js";
import type { LeaveRequestRow } from "../../types/leave-request.types.js";

type TxClient = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | TxClient;

export type UpdateRequestResult = { request: LeaveRequestRow } | { conflict: true };

export async function insertLeaveRequest(
  data: typeof leaveRequests.$inferInsert,
  client: DbClient = db
): Promise<LeaveRequestRow> {
  const rows = await client.insert(leaveRequests).values(data).returning();
  const row = rows[0];
  if (!row) throw new Error("Insert returned no rows");
  return row;
}

export async function approveRequestWithDeduction(
  requestPublicId: string,
  reviewerId: number,
  note: string | undefined,
  tx: TxClient
): Promise<UpdateRequestResult> {
  const rows = await tx
    .update(leaveRequests)
    .set({
      status: "approved",
      reviewerId,
      reviewNote: note ?? null,
      updatedAt: new Date(),
    })
    .where(and(eq(leaveRequests.publicId, requestPublicId), eq(leaveRequests.status, "pending")))
    .returning();

  const row = rows[0];
  if (!row) return { conflict: true };

  await tx
    .update(leaveBalances)
    .set({
      usedDays: sql`${leaveBalances.usedDays}
            +
            ${row.workingDays}`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(leaveBalances.userId, row.userId),
        eq(leaveBalances.leaveTypeId, row.leaveTypeId),
        eq(leaveBalances.year, Number(row.startsAt.slice(0, 4)))
      )
    );

  return { request: row };
}

export async function rejectRequest(
  requestPublicId: string,
  reviewerId: number,
  note: string | undefined,
  tx: TxClient
): Promise<UpdateRequestResult> {
  const rows = await tx
    .update(leaveRequests)
    .set({
      status: "rejected",
      reviewerId,
      reviewNote: note ?? null,
      updatedAt: new Date(),
    })
    .where(and(eq(leaveRequests.publicId, requestPublicId), eq(leaveRequests.status, "pending")))
    .returning();

  return rows[0] ? { request: rows[0] } : { conflict: true };
}
