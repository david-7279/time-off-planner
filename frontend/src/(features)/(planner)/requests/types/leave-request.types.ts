// src/(features)/(planner)/requests/types/leave-request.types.ts

/**
 * Feature-owned types only — the WIRE shapes (LeaveRequest, OverlapWarning,
 * LeaveRequestListQuery, PaginatedData) live in lib/api/types/api.types.ts
 * and are imported, not redefined.
 */
import type { LeaveRequest } from '@/src/lib/api/types/api.types.ts'

/** Body for POST /leave-requests — exactly the three fields the API allows. */
export type CreateLeaveRequestPayload = {
    leaveTypeId: number
    startsAt: string // "YYYY-MM-DD" — validated by the Zod schema before this type sees it
    endsAt: string
}

/** A list entry enriched with what the UI rows need (via the joined list query). */
export type LeaveRequestListItem = LeaveRequest

/** The created-request result — what the POST returns inside the envelope. */
export type CreateLeaveRequestResult = {
    request: LeaveRequest
    balanceProjection: { remainingBefore: number; remainingAfter: number }
}
