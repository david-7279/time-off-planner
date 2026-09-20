// src/features/leave-requests/repository/query/qyery-command-leave-request.repository.ts

import { and, asc, desc, eq, getTableColumns, gte, inArray, lte, type SQL, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../../../core/database/db.js";
import {
  type LeaveRequestRow,
  leaveRequests,
  leaveTypes,
  users,
} from "../../../../core/database/schema/index.js";
import type { LeaveRequestDetail } from "../../dto/response/leave-request.response.js";
import type { SortField } from "../../types/leave-request.types.js";

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
  sortBy?: SortField;
  sortDirection?: "asc" | "desc";
};

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

// ── Sorting

const SORTABLE_FIELDS = {
  startsAt: leaveRequests.startsAt,
  createdAt: leaveRequests.createdAt,
  status: leaveRequests.status,
} as const;

const DEFAULT_SORT: SortField = "startsAt";

// ── The shared condition builder

function buildConditions(options: FindLeaveRequestsOptions): SQL | undefined {
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

  return conditions.length ? and(...conditions) : undefined;
}

// ── The joined shape

const reviewer = alias(users, "reviewer");
const leaveRequestWithJoins = {
  ...getTableColumns(leaveRequests),
  leaveTypeName: leaveTypes.name,
  leaveTypePublicId: leaveTypes.publicId,
  reviewerPublicId: reviewer.publicId,
};

/**
 * Find leave requests based on the provided options.
 * @param options The options to filter the leave requests.
 * @param client The database client to use.
 */
export async function findLeaveRequests(
  options: FindLeaveRequestsOptions,
  client: DbClient = db
): Promise<LeaveRequestDetail[]> {
  const limit = Math.min(options.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
  const sortColumn = SORTABLE_FIELDS[options.sortBy ?? DEFAULT_SORT];
  const direction = options.sortDirection === "asc" ? asc : desc;

  return client
    .select(leaveRequestWithJoins)
    .from(leaveRequests)
    .innerJoin(leaveTypes, eq(leaveTypes.id, leaveRequests.leaveTypeId))
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .leftJoin(reviewer, eq(reviewer.id, leaveRequests.reviewerId))
    .where(buildConditions(options))
    .orderBy(direction(sortColumn), asc(leaveRequests.id))
    .limit(limit)
    .offset(options.offset ?? 0);
}

/**
 * Find a leave request by its public ID.
 * @param publicId The public ID of the leave request to find.
 * @param client The database client to use.
 */
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

/**
 * Count the number of leave requests that match the provided options.
 * @param options The options to filter the leave requests.
 * @param client The database client to use.
 */
export async function countLeaveRequests(
  options: FindLeaveRequestsOptions,
  client: DbClient = db
): Promise<number> {
  const needsUsersJoin = options.teamId !== undefined;

  if (needsUsersJoin) {
    return client
      .select({ value: sql<number>`count(*)::int` })
      .from(leaveRequests)
      .innerJoin(users, eq(users.id, leaveRequests.userId))
      .where(buildConditions(options))
      .execute()
      .then((rows) => rows[0]?.value ?? 0);
  }

  const rows = await client
    .select({ value: sql<number>`count(*)::int` })
    .from(leaveRequests)
    .where(buildConditions(options));
  return rows[0]?.value ?? 0;
}
