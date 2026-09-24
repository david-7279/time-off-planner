// src/(features)/(planner)/team-calendar/store/team-calendar.store.ts

import { create } from 'zustand'

interface TeamCalendarStore {
    year: number
    /** 1–12, matching the API's ?month= convention. */
    month: number
    goToMonth: (year: number, month: number) => void
    nextMonth: () => void
    previousMonth: () => void
}

export const useTeamCalendarStore = create<TeamCalendarStore>((set, get) => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // Date months are 0-based; API is 1-based

    goToMonth: (year, month) => set({ year, month }),

    nextMonth: () => {
        const { year, month } = get()
        if (month === 12) set({ year: year + 1, month: 1 })
        else set({ year, month: month + 1 })
    },

    previousMonth: () => {
        const { year, month } = get()
        if (month === 1) set({ year: year - 1, month: 12 })
        else set({ year, month: month - 1 })
    },
}))
