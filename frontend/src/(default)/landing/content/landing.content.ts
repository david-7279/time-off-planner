// src/(default)/landing/content/landing.content.ts

export const LANDING_HEADER = {
    wordmark: 'Time Off Planner',
    tagline: 'The team leave ledger',
    nav: [{ label: 'Legal', href: '/terms' }],
} as const

export const HERO = {
    kicker: 'Leave requests · Approvals · Balances',
    headline: "The team's record of time off.",
    subheadline:
        'Time Off is the immutable leave entitlement ledger and cryptographic attendance engine designed ' +
        'for high-discipline studios, architectural practices, and statutory enterprises. ' +
        'No more lostSlack messages.',
    primaryCta: { label: 'Create an account', href: '/auth' },
    secondaryCta: { label: 'See how it works', href: '/#how-it-works' },
} as const

/**
 * The metrics strip — every figure is a verifiable property of the system.
 * Audit rule: each entry must name the file or behavior that proves it.
 */
export const METRICS = [
    {
        kicker: 'Sessions',
        value: '15 min',
        body: 'Access tokens expire automatically. Refresh sessions last 7 days.',
    },
    {
        kicker: 'Credentials',
        value: 'bcrypt',
        body: 'Passwords are stored as hashes — plaintext is never kept or logged.',
    },
    {
        kicker: 'Data boundary',
        value: 'Team-scoped',
        body: 'Records are visible within your team only — enforced in the database and on every request.',
    },
    {
        kicker: 'Decisions',
        value: 'Final',
        body: "A review — approval or rejection — is recorded once, with the reviewer's name. The system does not allow a second decision.",
    },
] as const

export const WORKFLOW = {
    kicker: 'How it works',
    heading: 'Three steps, one accurate record.',
    steps: [
        {
            tier: 'Step 01',
            code: 'REQUEST',
            title: 'Ask for the days',
            body: 'Pick a date range and leave type. The system counts working days — weekends excluded, boundaries exact — and shows what your balance would look like after approval.',
            facts: [
                ['Working days counted', 'Server-side, timezone-safe'],
                ['Weekends', 'Never counted'],
                ['Balance preview', 'Shown before you submit'],
            ],
            footnote: 'Your request enters the queue',
        },
        {
            tier: 'Step 02',
            code: 'REVIEW',
            title: 'A manager decides',
            body: 'Your manager sees the request alongside the team calendar — including who else is already off those dates — and approves or rejects, with an optional note you can read.',
            facts: [
                ['Overlap warning', 'Shown at decision time'],
                ['Team scope', 'Managers review their team only'],
                ['Decision', 'One, final, attributed'],
            ],
            footnote: 'Exactly one decision wins',
        },
        {
            tier: 'Step 03',
            code: 'LEDGER',
            title: 'The balance is true',
            body: 'Approval deducts the working days from your balance in the same transaction that records the decision. Rejection deducts nothing. Balances are audited against the request record on every read.',
            facts: [
                ['Deduction', 'Atomic with the decision'],
                ['Audit', 'Stored counter vs. actual records'],
                ['Calendar', 'Approved leave appears team-wide'],
            ],
            footnote: 'Counted honestly, provably',
        },
    ],
} as const

export const MODULES = {
    kicker: 'Modules',
    heading: 'Four screens, one ledger.',
    items: [
        {
            value: 'balances',
            kicker: 'Module 01',
            title: 'Balances',
            body: 'Allowance, used, and remaining per leave type — per year, at a glance.',
        },
        {
            value: 'requests',
            kicker: 'Module 02',
            title: 'My requests',
            body: "Every request you've made, filterable and sortable, with reviewer notes.",
        },
        {
            value: 'calendar',
            kicker: 'Module 03',
            title: 'Team calendar',
            body: "Who's off, when — the whole team's month on one grid, before you ask.",
        },
        {
            value: 'approvals',
            kicker: 'Module 04',
            title: 'Approvals',
            body: "Managers review their team's pending requests with overlap warnings at hand.",
        },
    ],
} as const

export const CTA = {
    kicker: 'Start',
    headline: "Keep the team's record accurate.",
    body: 'Create an account, request your first days off, and let the ledger do the counting.',
    button: { label: 'Create an account', href: '/auth' },
} as const
