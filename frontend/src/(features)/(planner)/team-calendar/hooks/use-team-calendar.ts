// src/(features)/(planner)/team-calendar/hooks/use-team-calendar.ts
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { TeamCalendarApi } from '../api/team-calendar.api.ts'
import { useTeamCalendarStore } from '../store/team-calendar.store.ts'

/**
 * The team calendar for the currently selected month.
 * UI state (which month) comes from Zustand; server state (the entries)
 * comes from TanStack Query, keyed by that month. keepPreviousData keeps
 * the previous month's grid visible (dimmed) while the new one loads.
 */
export function useTeamCalendar() {
    const { year, month, nextMonth, previousMonth } = useTeamCalendarStore()

    const query = useQuery({
        queryKey: ['calendar', year, month] as const,
        queryFn: () => TeamCalendarApi.getTeamCalendar(year, month),
        placeholderData: keepPreviousData,
        staleTime: 15_000,
    })

    return {
        calendar: query.data ?? null,
        isPending: query.isPending,
        isFetching: query.isFetching,
        nextMonth,
        previousMonth,
    }
}
