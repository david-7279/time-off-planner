// src/(features)/(planner)/team-calendar/types/team-calendar.types.ts

/**
 * Calendar wire shapes (CalendarData, CalendarEntry) live in
 * lib/api/types/api.types.ts — the single source of wire truth.
 *
 * This file owns only feature-specific types.
 */

import type { CalendarEntry } from '@/src/lib/api/types/api.types.ts'

/** Month selection state — lives in the Zustand store, feeds the query key. */
export type SelectedMonth = {
    year: number
    month: number // 1–12, matching the API's ?month= convention
}

/** Calendar entry with UI-facing derived flags (computed at render). */
export type CalendarEntryView = {
    entry: CalendarEntry
    /** true when the entry's dates extend beyond the displayed month. */
    spillsOutsideMonth: boolean
}
