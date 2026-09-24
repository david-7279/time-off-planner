// src/(features)/(planner)/requests/api/leave-request.api.ts

import { http } from '@/src/lib/api/api-client.ts'
import type {
    ApiSuccess,
    LeaveRequest,
    LeaveRequestListQuery,
    OverlapWarning,
    PaginatedData,
} from '@/src/lib/api/types/api.types.ts'
import type {
    CreateLeaveRequestPayload,
    CreateLeaveRequestResult,
} from '../types/leave-request.types.ts'

const URL = '/leave-requests'

/** Axios drops undefined params — the query object is always safe to pass whole. */
function listParams(query: LeaveRequestListQuery) {
    return {
        page: query.page,
        pageSize: query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        status: query.status,
    }
}

export const LeaveRequestApi = {
    /** POST /leave-requests — create a pending request. */
    create: async (payload: CreateLeaveRequestPayload): Promise<CreateLeaveRequestResult> => {
        const res = await http.post<ApiSuccess<CreateLeaveRequestResult>>(URL, payload)
        return res.data.data
    },

    /** GET /leave-requests/me — paginated, filtered, sorted list. */
    listMy: async (query: LeaveRequestListQuery): Promise<PaginatedData<LeaveRequest>> => {
        const res = await http.get<ApiSuccess<PaginatedData<LeaveRequest>>>(`${URL}/me`, {
            params: listParams(query),
        })
        return res.data.data
    },

    /** GET /leave-requests/team — manager's team list. */
    listTeam: async (query: LeaveRequestListQuery): Promise<PaginatedData<LeaveRequest>> => {
        const res = await http.get<ApiSuccess<PaginatedData<LeaveRequest>>>(`${URL}/team`, {
            params: listParams(query),
        })
        return res.data.data
    },

    /** GET /leave-requests/:id — single request detail. */
    getByPublicId: async (publicId: string): Promise<LeaveRequest> => {
        const res = await http.get<ApiSuccess<{ request: LeaveRequest }>>(`${URL}/${publicId}`)
        return res.data.data.request
    },

    /** GET /leave-requests/:id/overlaps — approved teammate conflicts. */
    getOverlaps: async (publicId: string): Promise<OverlapWarning[]> => {
        const res = await http.get<ApiSuccess<{ overlaps: OverlapWarning[] }>>(
            `${URL}/${publicId}/overlaps`,
        )
        return res.data.data.overlaps
    },

    /** PATCH /leave-requests/:id — manager decision (used by the approvals screen). */
    review: async (
        publicId: string,
        input: { status: 'approved' | 'rejected'; note?: string },
    ): Promise<LeaveRequest> => {
        const res = await http.patch<ApiSuccess<{ request: LeaveRequest }>>(
            `${URL}/${publicId}`,
            input,
        )
        return res.data.data.request
    },
}
