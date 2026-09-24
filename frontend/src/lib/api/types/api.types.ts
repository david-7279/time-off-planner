// src/lib/api/types/api.types.ts
/**
 * API contract — transcriptions of the backend's ACTUAL responses
 * (verified in Postman). Single source of wire truth for the whole app.
 *
 * Order of declarations: envelopes → pagination → shared primitives →
 * domain blocks (leave requests → balances → calendar → auth).
 * When the backend changes, this file changes first.
 */

// ── Envelopes ──────────────────────────────────────────────────────────────

/** Success envelope — every backend response is wrapped in this. */
export type ApiSuccess<T> = {
    success: true
    message: string
    data: T
}

export type ApiFieldErrors = Record<string, string[]>

/** Failure envelope — 4xx/5xx bodies, normalized into ApiError by the client. */
export type ApiErrorBody = {
    success: false
    error: {
        message: string
        /** Per-field validation detail — present on 400 validation failures. */
        fields?: ApiFieldErrors
    }
}

// ── Pagination ─────────────────────────────────────────────────────────────

export type PaginationMeta = {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}

/** Payload of every list endpoint. */
export type PaginatedData<T> = {
    items: T[]
    pagination: PaginationMeta
}

// ── Shared primitives ──────────────────────────────────────────────────────

/** Leave-request status — mirrors the backend's request_status pgEnum exactly. */
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected'

/** Sort fields supported by list endpoints — mirrors the repository allowlist. */
export type SortField = 'startsAt' | 'createdAt' | 'status'

export type SortDirection = 'asc' | 'desc'

/** Query contract of the list endpoints (/me, /team). */
export type LeaveRequestListQuery = {
    page?: number
    pageSize?: number
    sortBy?: SortField
    sortDirection?: SortDirection
    status?: LeaveRequestStatus
}

// ── Domain: leave requests ─────────────────────────────────────────────────

/** One leave request as served by the API — never raw DB columns. */
export type LeaveRequest = {
    publicId: string
    leaveTypePublicId: string
    leaveTypeName: string
    startsAt: string // "YYYY-MM-DD"
    endsAt: string // "YYYY-MM-DD"
    workingDays: number
    status: LeaveRequestStatus
    /** null ⟺ pending — the schema's reviewed-ness signal. */
    reviewerPublicId: string | null
    reviewNote: string | null
    createdAt: string // ISO
}

/** Returned by POST /leave-requests alongside the created request. */
export type BalanceProjection = {
    remainingBefore: number
    remainingAfter: number
}

/** Approved teammate conflicts — the review-screen soft warning. */
export type OverlapWarning = {
    publicId: string
    userName: string
    leaveTypeName: string
    startsAt: string
    endsAt: string
    status: LeaveRequestStatus
}

// ── Domain: balances ───────────────────────────────────────────────────────

/** One balance row as served by GET /balances/me. */
export type LeaveBalance = {
    leaveTypePublicId: string
    leaveTypeName: string
    year: number
    allowanceDays: number
    usedDays: number
    /** Derived server-side: allowanceDays − usedDays. */
    remaining: number
}

/** Payload of GET /balances/me (arrives under data.balances). */
export type BalancesData = {
    year: number
    items: LeaveBalance[]
}

// ── Domain: calendar ───────────────────────────────────────────────────────

/** Team leave entry overlapping a displayed month. */
export type CalendarEntry = {
    publicId: string
    userPublicId: string
    userName: string
    leaveTypeName: string
    startsAt: string
    endsAt: string
    workingDays: number
    status: LeaveRequestStatus
}

/** Payload of GET /calendar (arrives under data.calendar). */
export type CalendarData = {
    year: number
    month: number
    entries: CalendarEntry[]
}

// ── Domain: authentication ─────────────────────────────────────────────────

export type UserRole = 'member' | 'manager'

export type AuthSession = {
    user: {
        id: number
        publicId: string
        name: string
        email: string
        role: UserRole
        teamId: number | null
    }
    token: {
        accessToken: string
    }
}
