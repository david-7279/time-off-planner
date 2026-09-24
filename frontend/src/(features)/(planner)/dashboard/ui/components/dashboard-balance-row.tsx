// src/(features)/(planner)/dashboard/ui/components/dashboard-balance-row.tsx

import { Skeleton } from '@/src/components/ui/skeleton.tsx'
import type { BalancesData } from '@/src/lib/api/types/api.types.ts'

interface DashboardBalanceRowProps {
    /** Balance rows for the displayed year — from GET /balances/me. */
    items: BalancesData['items']
}

/**
 * The balance ledger: one ruled strip — divided columns, giant serif
 * numerals, small-caps labels. Semantically a definition list: the leave
 * type is the term, the figures are the description.
 *
 * Negative `remaining` renders honestly (overdrawn by approval) — the
 * design allows over-requesting; the manager decides.
 */
export function DashboardBalanceRow({ items }: DashboardBalanceRowProps) {
    return (
        <dl className="grid grid-cols-1 divide-y border-y border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 lg:divide-x lg:divide-border">
            {items.map((balance) => (
                <div
                    key={balance.leaveTypePublicId}
                    className="flex flex-col justify-center gap-2 px-6 py-10"
                >
                    {/* Numeral — the design's data moment: padded, serif, tabular */}
                    <dd className="font-display text-7xl font-medium tabular-nums">
                        {String(balance.remaining).padStart(2, '0')}
                        <span className="ml-2 align-baseline text-xs font-normal uppercase tracking-widest text-muted-foreground">
                            rem
                        </span>
                    </dd>

                    {/* Term + usage — the small-caps system, two weights */}
                    <dt className="text-xs font-bold uppercase tracking-widest">
                        {balance.leaveTypeName}
                    </dt>
                    <dd className="text-xs uppercase tracking-widest text-muted-foreground">
                        {balance.usedDays} of {balance.allowanceDays} d
                    </dd>
                </div>
            ))}
        </dl>
    )
}

/** Skeleton mirrors the real layout — pulsing rules, not a spinner. */
export function DashboardBalanceRowSkeleton() {
    return (
        <div className="grid grid-cols-1 divide-y border-y border-border sm:grid-cols-3 sm:divide-y-0 lg:divide-x lg:divide-border">
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-2 px-6 py-10">
                    <Skeleton className="h-16 w-24" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-20" />
                </div>
            ))}
        </div>
    )
}
