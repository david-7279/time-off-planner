// src/(default)/legal/ui/privacy/page.tsx

import { CalendarClockIcon, DatabaseBackupIcon, KeyRoundIcon, UsersIcon } from 'lucide-react'
import {
    LegalAside,
    type LegalSectionLink,
} from '@/src/(default)/legal/ui/components/legal-aside.tsx'
import {
    LegalDocumentCard,
    type LegalPolicySection,
} from '@/src/(default)/legal/ui/components/legal-document-card.tsx'
import LegalStatCard from '@/src/(default)/legal/ui/components/legal-stat-card.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Badge } from '@/src/components/ui/badge.tsx'
import { Card, CardContent } from '@/src/components/ui/card.tsx'
import { Text } from '@/src/components/ui/text.tsx'

const PRIVACY_STATUS = [
    {
        title: 'Session lifetime',
        icon: KeyRoundIcon,
        label: '15 min',
        description: 'Access tokens expire automatically; refresh sessions last 7 days.',
    },
    {
        title: 'Password storage',
        icon: DatabaseBackupIcon,
        label: 'bcrypt',
        description: 'Hashed with bcryptjs — plaintext is never stored or logged.',
    },
    {
        title: 'Data access boundary',
        icon: UsersIcon,
        label: 'Team-scoped',
        description: 'Enforced in the database and on every request — no cross-team reads.',
    },
    {
        title: 'Records kept',
        icon: CalendarClockIcon,
        label: 'While active',
        description: 'Balances and leave records persist while your account is active.',
    },
]

export const PRIVACY_SECTIONS: LegalPolicySection[] = [
    {
        number: '01',
        id: 'information-collected',
        title: 'Information we collect',
        reference: 'PRV-101',
        paragraphs: [
            'We collect only what the service needs to schedule and approve leave. ' +
                'There are no hidden categories: the list below is complete.',
        ],
        clauses: [
            {
                code: 'Provided by you // 1.1',
                title: 'Account information',
                body:
                    'Your name, work email address, and password. The password is stored only as a bcrypt hash — ' +
                    'we never see or store the text you type. Your team assignment and role (member or manager) ' +
                    'are set when your account is provisioned.',
            },
            {
                code: 'Created by you // 1.2',
                title: 'Leave records',
                body:
                    'The leave requests you submit (dates, type, optional note), the approvals or rejections they ' +
                    "receive, who reviewed them, and the resulting balance changes. These records form your team's " +
                    'shared calendar and are visible to your team.',
            },
            {
                code: 'Collected automatically // 1.3',
                title: 'Technical data',
                body:
                    'Your IP address is used to rate-limit abuse of the login and signup endpoints and is not ' +
                    'persisted. Session tokens are stored in your browser to keep you signed in. We do not use ' +
                    'advertising cookies, analytics trackers, or fingerprinting.',
            },
        ],
    },
    {
        number: '02',
        id: 'how-we-use-it',
        title: 'Why we process your data',
        reference: 'PRV-102',
        paragraphs: [
            'Your data is used to run the service you signed up for: creating and ' +
                "approving leave requests, tracking balances, showing your team's " +
                'calendar, and keeping accounts secure. We do not sell your data, ' +
                'use it for advertising, or profile your behavior.',
        ],
        clauses: [
            {
                code: 'Basis // 2.1',
                title: 'Contract performance',
                body:
                    'Processing your account and leave records is necessary to provide the service your ' +
                    'organization uses.',
            },
            {
                code: 'Basis // 2.2',
                title: 'Legitimate interest — security',
                body: 'IP-based rate limiting and session verification protect the service from unauthorized access.',
            },
        ],
    },
    {
        number: '03',
        id: 'sharing',
        title: 'Who can see your data',
        reference: 'PRV-103',
        paragraphs: [
            'Your leave records are visible to members and managers of your own ' +
                'team — that visibility is the product. Managers can review your ' +
                'requests; they cannot see balances or records of other teams.',
        ],
        clauses: [
            {
                code: 'Sharing // 3.1',
                title: 'Third parties',
                body:
                    'We share data only with the infrastructure providers required to host the service ' +
                    '[list your hosting provider and database host]. We do not share data with advertisers, ' +
                    'analytics companies, or data brokers. No third-party tracking scripts run on this application.',
            },
        ],
    },
    {
        number: '04',
        id: 'retention',
        title: 'How long we keep it',
        reference: 'PRV-104',
        paragraphs: [
            'Account and leave records are kept while your account is active, so ' +
                'that balances and the team calendar stay accurate year over year. ' +
                'Login sessions expire 15 minutes after issuance and their records ' +
                'are removed when they end.',
        ],
        clauses: [
            {
                code: 'Deletion // 4.1',
                title: 'When you leave',
                body:
                    'When your account is deactivated or deleted, your personal data is removed; ' +
                    '[decide and state: leave records are anonymized and kept / deleted entirely — ' +
                    'pick one and do it in code].',
            },
        ],
    },
    {
        number: '05',
        id: 'your-rights',
        title: 'Your rights',
        reference: 'PRV-105',
        paragraphs: [
            'You can access, correct, or delete your personal data at any time: ' +
                'balances and requests are visible in the app, account details can ' +
                'be corrected by your manager, and deletion requests are honored ' +
                'within 30 days.',
        ],
        clauses: [
            {
                code: 'Contact // 5.1',
                title: 'How to exercise them',
                body:
                    'Contact your data controller at [time-off-planner@gmail.com] — or use the in-app channels ' +
                    'above. You also have the right to lodge a complaint with your local data protection authority.',
            },
        ],
    },
    {
        number: '06',
        id: 'security',
        title: 'How we protect it',
        reference: 'PRV-106',
        paragraphs: [
            'Passwords are hashed with bcrypt. Access is token-based and expires ' +
                'automatically. All traffic runs over HTTPS. Role and team ' +
                'boundaries are enforced in the database and on every request — ' +
                "a member can never read another team's records, by design.",
        ],
    },
]

const SECTION_LINKS: LegalSectionLink[] = PRIVACY_SECTIONS.map((s) => ({
    number: s.number,
    title: s.title.split(',')[0],
    anchor: s.id,
    reference: `§ ${s.number}.0`,
}))

const PrivacyPage = () => {
    return (
        <SafeArea>
            <Wrapper className="flex w-full flex-col gap-10 p-10">
                <Card>
                    <CardContent className="flex flex-row justify-between items-center gap-2">
                        <div className="inline-flex items-center gap-1">
                            <div className="w-2 h-2 bg-foreground" />
                            <Text variant="xs" className="uppercase text-foreground font-medium">
                                Legal & Statutory Governance {'//'} DOC-2026-v1.0
                            </Text>
                            <Text variant="xs" className="uppercase">
                                · Classification: Tier-1 Institutional Binding
                            </Text>
                        </div>

                        <Badge variant="default" className="uppercase">
                            Official Policies
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col space-y-8 max-w-4xl">
                        <Text variant="xs" className="uppercase tracking-wider">
                            [ Codex Statutory ]
                        </Text>
                        <div>
                            <Text variant="h1"> Privacy Policy.</Text>
                            <Text
                                variant="p"
                                className="text-[16px] text-muted-foreground leading-relaxed"
                            >
                                How Time Off Planner collects, uses, and protects the personal data
                                of the people whose time it tracks.
                            </Text>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
                    {PRIVACY_STATUS.map((stat) => (
                        <LegalStatCard key={stat.title} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-[16rem_1fr]">
                    <aside className="md:sticky md:top-8 md:self-start">
                        <LegalAside
                            title="Policies Sections"
                            countLabel="nodes"
                            sections={SECTION_LINKS}
                        />
                    </aside>

                    <main>
                        <LegalDocumentCard sections={PRIVACY_SECTIONS} />
                    </main>
                </div>
            </Wrapper>
        </SafeArea>
    )
}
export default PrivacyPage
