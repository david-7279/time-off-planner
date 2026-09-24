// features/calendar/repository/query/query-calendar.repository.ts

import { and, asc, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../../../../core/database/db.js";
import { leaveRequests, leaveTypes, users } from "../../../../core/database/schema/index.js";
import type { CalendarEntry } from "../types/calendar.types.js";

type TxClient = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | TxClient;

/**
 * Find calendar entries for a team's leave overlapping the given date range.
 *
 * Overlap semantics: starts_at <= rangeEnd AND ends_at >= rangeStart —
 * any touch counts (a request starting the last day of the previous month
 * appears on this month's grid).
 *
 * Includes approved AND pending entries — pending is flagged by status and
 * rendered differently by the UI. Pending leave is exactly what a teammate
 * wants to see before requesting the same week.
 */
export async function findCalendarEntries(
  teamId: number,
  rangeStart: string,
  rangeEnd: string,
  client: DbClient = db
): Promise<CalendarEntry[]> {
  return client
    .select({
      publicId: leaveRequests.publicId,
      userPublicId: users.publicId,
      userName: users.name,
      leaveTypeName: leaveTypes.name,
      startsAt: leaveRequests.startsAt,
      endsAt: leaveRequests.endsAt,
      workingDays: leaveRequests.workingDays,
      status: leaveRequests.status,
    })
    .from(leaveRequests)
    .innerJoin(users, eq(users.id, leaveRequests.userId))
    .innerJoin(leaveTypes, eq(leaveTypes.id, leaveRequests.leaveTypeId))
    .where(
      and(
        eq(users.teamId, teamId),
        inArray(leaveRequests.status, ["approved", "pending"]),
        lte(leaveRequests.startsAt, rangeEnd),
        gte(leaveRequests.endsAt, rangeStart)
      )
    )
    .orderBy(asc(leaveRequests.startsAt), asc(leaveRequests.id));
}
