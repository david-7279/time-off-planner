// src/(features)/(planner)/team-calendar/api/team-calendar.api.ts

import { http } from '@/src/lib/api/api-client.ts'
import type { ApiSuccess, CalendarData } from '@/src/lib/api/types/api.types.ts'

const URL = '/calendar'

export const TeamCalendarApi = {
    /**
     * GET /calendar?year&month — team leave overlapping the displayed month.
     * Returns approved AND pending entries (flagged by status); not paginated —
     * a month is a month.
     */
    getTeamCalendar: async (year: number, month: number): Promise<CalendarData> => {
        const res = await http.get<ApiSuccess<CalendarData>>(URL, {
            params: { year, month },
        })
        return res.data.data
    },
}
