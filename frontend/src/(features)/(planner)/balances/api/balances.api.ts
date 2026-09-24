// src/(features)/(planner)/balances/api/balances.api.ts

import type { BalancesPayload } from '@/src/(features)/(planner)/balances/types/balances.types.ts'
import { http } from '@/src/lib/api/api-client.ts'
import type { ApiSuccess } from '@/src/lib/api/types/api.types.ts'

export const BalanceApi = {
    /** GET /leave-balances/me — returns the user's balances for the current year. */
    getMyBalance: async (): Promise<BalancesPayload> => {
        const res = await http.get<ApiSuccess<{ balances: BalancesPayload }>>('/leave-balances/me')
        return res.data.data.balances
    },
}
