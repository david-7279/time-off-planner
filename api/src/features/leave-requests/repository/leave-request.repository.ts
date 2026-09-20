import { and, asc, desc, eq, getTableColumns, gte, inArray, lte, type SQL, sql } from "drizzle-orm";
import { db } from "../../../core/database/db.js";
import {
  leaveBalances,
  leaveRequests,
  leaveTypes,
  users,
} from "../../../core/database/schema/index.js";
import type { LeaveRequestRow, LeaveRequestWithType } from "../types/leave-request.types.js";

type TxClient = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | TxClient;

export type FindLeaveRequestsOptions = {
  userId?: number;
  statuses?: LeaveRequestRow["status"][];
  teamId?: number;
  overlapsStart?: string;
  overlapsEnd?: string;
  limit?: number;
  offset?: number;
};

export type UpdateRequestResult = { request: LeaveRequestRow } | { conflict: true };

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/** Flat joined shape: every request column + leave type display fields. */
const leaveRequestWithLeaveType = {
  ...getTableColumns(leaveRequests),
  leaveTypeName: leaveTypes.name,
  leaveTypePublicId: leaveTypes.publicId,
};

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

export async function findLeaveRequestByPublicId(
  publicId: string,
  client: DbClient = db
): Promise<LeaveRequestRow | null> {
  const rows = await client
    .select()
    .from(leaveRequests)
    .where(eq(leaveRequests.publicId, publicId))
    .limit(1);
  return rows[0] ?? null;
}

export async function findLeaveRequestWithTeam(
  publicId: string,
  client: DbClient = db
): Promise<{
  request: LeaveRequestRow;
  requesterTeamId: number | null;
} | null> {
  const rows = await client
    .select({ request: leaveRequests, requesterTeamId: users.teamId })
    .from(leaveRequests)
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .where(eq(leaveRequests.publicId, publicId))
    .limit(1);
  return rows[0] ?? null;
}

export async function findLeaveRequests(
  options: FindLeaveRequestsOptions,
  client: DbClient = db
): Promise<LeaveRequestWithType[]> {
  const conditions: SQL[] = [];

  if (options.userId !== undefined) {
    conditions.push(eq(leaveRequests.userId, options.userId));
  }
  if (options.statuses?.length) {
    conditions.push(inArray(leaveRequests.status, options.statuses));
  }
  if (options.teamId !== undefined) {
    conditions.push(eq(users.teamId, options.teamId));
  }
  if (options.overlapsStart !== undefined) {
    conditions.push(gte(leaveRequests.endsAt, options.overlapsStart));
  }
  if (options.overlapsEnd !== undefined) {
    conditions.push(lte(leaveRequests.startsAt, options.overlapsEnd));
  }

  const limit = Math.min(options.limit ?? DEFAULT_LIMIT, MAX_LIMIT);

  return client
    .select(leaveRequestWithLeaveType)
    .from(leaveRequests)
    .innerJoin(leaveTypes, eq(leaveTypes.id, leaveRequests.leaveTypeId))
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(leaveRequests.startsAt), asc(leaveRequests.id))
    .limit(limit)
    .offset(options.offset ?? 0);
}
