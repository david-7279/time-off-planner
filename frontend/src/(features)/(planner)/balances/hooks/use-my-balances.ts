// src/(features)/(planner)/balances/hooks/use-my-balances.ts

import { useQuery } from '@tanstack/react-query'
import { http } from '@/src/lib/api/api-client.ts'
import type { ApiSuccess, BalancesData } from '@/src/lib/api/types/api.types.ts'

export function useMyBalances() {
    return useQuery({
        queryKey: ['balances', 'me'] as const,
        queryFn: async (): Promise<BalancesData> => {
            const res = await http.get<ApiSuccess<BalancesData>>('/balances/me')
            return res.data.data
        },
        staleTime: 60_000,
    })
}
