// src/(features)/(planner)/dashboard/hooks/use-upcoming-leave.ts

import { useQuery } from '@tanstack/react-query'
import { http } from '@/src/lib/api/api-client.ts'
import type { ApiSuccess, LeaveRequest, PaginatedData } from '@/src/lib/api/types/api.types.ts'

/** Today as "YYYY-MM-DD" — comparable with the API's DATE strings. */
function today(): string {
    return new Date().toISOString().slice(0, 10)
}

/**
 * The next approved request starting today or later.
 * Reuses the /me list (approved, soonest first) instead of a new endpoint —
 * the derivation is presentation logic.
 */
export function useUpcomingLeave() {
    return useQuery({
        queryKey: [
            'leave-requests',
            'me',
            { status: 'approved', sortBy: 'startsAt', sortDirection: 'asc' },
        ] as const,
        queryFn: async (): Promise<PaginatedData<LeaveRequest>> => {
            const res = await http.get<ApiSuccess<PaginatedData<LeaveRequest>>>(
                '/leave-requests/me',
                {
                    params: {
                        status: 'approved',
                        sortBy: 'startsAt',
                        sortDirection: 'asc',
                        pageSize: 50,
                    },
                },
            )
            return res.data.data
        },
        select: (data) =>
            data.items
                .filter((r) => r.startsAt >= today())
                .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0] ?? null,
        staleTime: 60_000,
    })
}
