// src/(features)/(planner)/dashboard/ui/page.tsx

import { ArrowRightIcon, PlusIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useMyBalances } from '@/src/(features)/(planner)/balances/hooks/use-my-balances.ts'
import { useTeamPresence } from '@/src/(features)/(planner)/dashboard/hooks/use-team-presence.ts'
import { useUpcomingLeave } from '@/src/(features)/(planner)/dashboard/hooks/use-upcoming-leave.ts'
import {
    DashboardBalanceRow,
    DashboardBalanceRowSkeleton,
} from '@/src/(features)/(planner)/dashboard/ui/components/dashboard-balance-row.tsx'
import { UpcomingLeaveSection } from '@/src/(features)/(planner)/dashboard/ui/components/upcoming-leave-section.tsx'
import AsideTopBar from '@/src/(features)/(planner)/ui/layout/components/aside-top-bar.tsx'
import { useAuthenticatedUser } from '@/src/(features)/authentication/hooks/use-authenticated-user.ts'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { paths } from '@/src/router/paths.ts'

function greeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
}

/**
 * Planner dashboard — the authenticated home.
 * Three async reads (balances, upcoming leave, team presence) share the
 * query cache with the list/calendar screens; each section owns its own
 * pending/error/empty state.
 */
export function PlannerDashboardPage() {
    const user = useAuthenticatedUser()
    const navigate = useNavigate()

    const balances = useMyBalances()
    const upcoming = useUpcomingLeave()
    const presence = useTeamPresence(user.publicId)
    const presenceLoading = upcoming.isPending || presence.isPending

    return (
        <SafeArea>
            <div className="shrink-0">
                <AsideTopBar title="Dashboard" />
            </div>

            <Wrapper className="flex w-full max-w-5xl flex-1 flex-col gap-10 overflow-y-auto p-10 pb-16">
                {/* ── Headline block — the page's one display moment ───────── */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Text
                            variant="xs"
                            className="uppercase tracking-widest text-muted-foreground"
                        >
                            Overview &amp; attendance · Planner
                        </Text>
                        <h1 className="font-display mt-2 text-6xl font-medium leading-[1.05] tracking-tight md:text-8xl">
                            {greeting()}, <em className="font-display italic">{user.name}</em>.
                        </h1>
                    </div>
                    <Button
                        className="shrink-0 rounded-none uppercase tracking-widest"
                        onClick={() => navigate(paths.timeOff.requests)}
                    >
                        Request leave <PlusIcon className="size-4" aria-hidden="true" />
                    </Button>
                </div>

                {/* ── Balances ledger ──────────────────────────────────────── */}
                <section aria-labelledby="balances-heading" className="flex flex-col">
                    <div className="flex items-center justify-between border-t border-border pt-6">
                        <h2
                            id="balances-heading"
                            className="text-xs font-medium uppercase tracking-widest"
                        >
                            Annual leave balances ({balances.data?.year ?? new Date().getFullYear()}
                            )
                        </h2>
                        <Link
                            to={paths.timeOff.balances}
                            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                        >
                            View breakdown{' '}
                            <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="mt-6">
                        {balances.isPending ? (
                            <DashboardBalanceRowSkeleton />
                        ) : balances.isError ? (
                            <div className="border-y border-border p-6">
                                <p className="text-sm text-muted-foreground">
                                    Couldn&apos;t load your balances.
                                </p>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 underline"
                                    onClick={() => balances.refetch()}
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : balances.data.items.length === 0 ? (
                            <div className="border-y border-border p-6">
                                <p className="text-sm text-muted-foreground">
                                    No leave balances for {balances.data.year} yet.
                                </p>
                            </div>
                        ) : (
                            <DashboardBalanceRow items={balances.data.items} />
                        )}
                    </div>
                </section>

                {/* ── Upcoming leave + team presence ───────────────────────── */}
                <UpcomingLeaveSection
                    upcoming={upcoming.data ?? null}
                    presence={presence.presence}
                    isLoading={presenceLoading}
                />
            </Wrapper>
        </SafeArea>
    )
}
