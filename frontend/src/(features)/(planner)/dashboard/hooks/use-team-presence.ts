// src/(features)/(planner)/dashboard/hooks/use-team-presence.ts

import { useQuery } from '@tanstack/react-query'
import { TeamCalendarApi } from '@/src/(features)/(planner)/team-calendar/api/team-calendar.api.ts'
import type { CalendarEntry } from '@/src/lib/api/types/api.types.ts'

const MAX_PRESENCE_ENTRIES = 3

/**
 * Teammates' approved leave for the current month — the dashboard's
 * ambient-awareness column. Excludes the current user (their leave is
 * the other column's job) via the entry's userPublicId.
 *
 * Shares the ["calendar", year, month] cache with the calendar page —
 * one request, two consumers.
 */
export function useTeamPresence(userPublicId: string): {
    presence: CalendarEntry[]
    isPending: boolean
} {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    const query = useQuery({
        queryKey: ['calendar', year, month] as const,
        queryFn: () => TeamCalendarApi.getTeamCalendar(year, month),
        staleTime: 15_000, // teammates submit leave while you watch
    })

    const presence = (query.data?.entries ?? [])
        .filter(
            (entry): entry is CalendarEntry & { userPublicId: string } =>
                entry.status === 'approved' && entry.userPublicId !== userPublicId,
        )
        .slice(0, MAX_PRESENCE_ENTRIES)

    return { presence, isPending: query.isPending }
}
