// src/(features)/(planner)/balances/types/balances.types.ts

import type { LeaveBalance } from '@/src/lib/api/types/api.types.ts'

/** Query params for a future ?year= override on GET /balances/me. */
export type BalancesQuery = {
    year?: number
}

/** A balance as displayed — adds the derived UI projection if needed later. */
export type BalanceView = LeaveBalance & {
    /** e.g. usage ratio for a future meter: usedDays / allowanceDays */
    // usageRatio: number
}

export type BalancesPayload = {
    year: number
    items: LeaveBalance[]
}
