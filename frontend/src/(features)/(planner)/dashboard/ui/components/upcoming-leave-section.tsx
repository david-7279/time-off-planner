// src/(features)/(planner)/dashboard/ui/components/upcoming-leave-section.tsx

import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/src/components/ui/badge.tsx'
import { Skeleton } from '@/src/components/ui/skeleton.tsx'
import type { CalendarEntry, LeaveRequest } from '@/src/lib/api/types/api.types.ts'
import { formatDateRange } from '@/src/lib/utils/format-date-range.ts'

interface UpcomingLeaveSectionProps {
    upcoming: LeaveRequest | null | undefined
    presence: CalendarEntry[] | undefined
    isLoading: boolean
}

export function UpcomingLeaveSection({ upcoming, presence, isLoading }: UpcomingLeaveSectionProps) {
    return (
        <section
            aria-labelledby="upcoming-heading"
            className="grid grid-cols-1 border-t border-border md:grid-cols-2 md:divide-x md:divide-border"
        >
            {/* ── Column 1: upcoming leave ─────────────────────────────── */}
            <div className="flex flex-col gap-5 border-b border-border py-8 md:border-b-0 md:pr-10">
                <div className="flex items-center justify-between">
                    <h3
                        id="upcoming-heading"
                        className="text-xs font-medium uppercase tracking-widest"
                    >
                        Your upcoming leave
                    </h3>
                    <Badge variant="outline" className="rounded-none uppercase tracking-widest">
                        Next scheduled
                    </Badge>
                </div>

                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-12 w-72" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                ) : !upcoming ? (
                    <p className="text-sm text-muted-foreground">
                        No upcoming leave — your next request will appear here.
                    </p>
                ) : (
                    <>
                        {/* Status badge: approved = inverted black (the system's status grammar) */}
                        <div className="flex items-center gap-3">
                            <Badge className="rounded-none uppercase tracking-widest">
                                {upcoming.leaveTypeName} · Confirmed
                            </Badge>
                            {upcoming.reviewerPublicId && (
                                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                                    Verified by your manager
                                </span>
                            )}
                        </div>

                        {/* The serif date range — this column's data moment */}
                        <p className="font-display text-4xl font-medium tracking-tight md:text-5xl">
                            {formatDateRange(upcoming.startsAt, upcoming.endsAt)}
                        </p>

                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            {upcoming.workingDays} working days ·{' '}
                            <span className="tabular-nums">
                                Ref {upcoming.publicId.slice(0, 8)}
                            </span>
                        </p>
                    </>
                )}

                <Link
                    to="/planner/requests"
                    className="group inline-flex items-center gap-1.5 border-b border-foreground pb-0.5 self-start text-sm font-medium hover:no-underline"
                >
                    All past and pending requests
                    <ArrowRightIcon
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                    />
                </Link>
            </div>

            {/* ── Column 2: team presence ─────────────────────────────────── */}
            <div className="flex flex-col gap-5 py-8 md:pl-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium uppercase tracking-widest">Team presence</h3>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        This month
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {[0, 1, 2].map((i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : !presence || presence.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No approved team leave this month.
                    </p>
                ) : (
                    <ul className="flex flex-col divide-y divide-border">
                        {presence.map((entry) => (
                            <li
                                key={entry.publicId}
                                className="flex items-baseline justify-between gap-4 py-3"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{entry.userName}</span>
                                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                                        {entry.leaveTypeName}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-display text-lg tabular-nums">
                                        {formatDateRange(entry.startsAt, entry.endsAt)}
                                    </span>
                                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                                        Approved
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <Link
                    to="/planner/team-calendar"
                    className="group inline-flex items-center gap-1.5 self-start text-xs font-medium uppercase tracking-widest underline underline-offset-2 hover:no-underline"
                >
                    Open team calendar
                    <ArrowRightIcon
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </section>
    )
}
