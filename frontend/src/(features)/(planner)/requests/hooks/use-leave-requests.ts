// src/(features)/(planner)/requests/hooks/use-leave-requests.ts

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { LeaveRequestListQuery } from '@/src/lib/api/types/api.types.ts'
import { LeaveRequestApi } from '../api/leave-request.api.ts'

/** The canonical key factory — pages and mutations must invalidate via these. */
export const leaveRequestKeys = {
    mine: (query: LeaveRequestListQuery) => ['leave-requests', 'me', query] as const,
    team: (query: LeaveRequestListQuery) => ['leave-requests', 'team', query] as const,
    detail: (publicId: string) => ['leave-requests', 'detail', publicId] as const,
    overlaps: (publicId: string) => ['leave-requests', 'overlaps', publicId] as const,
}

export function useMyLeaveRequests(query: LeaveRequestListQuery) {
    return useQuery({
        queryKey: leaveRequestKeys.mine(query),
        queryFn: () => LeaveRequestApi.listMy(query),
        placeholderData: keepPreviousData, // smooth paging — the calendar pattern
        staleTime: 30_000,
    })
}

export function useTeamLeaveRequests(query: LeaveRequestListQuery) {
    return useQuery({
        queryKey: leaveRequestKeys.team(query),
        queryFn: () => LeaveRequestApi.listTeam(query),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    })
}
