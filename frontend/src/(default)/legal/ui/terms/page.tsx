// src/(default)/legal/ui/terms/page.tsx

import { CheckCircle2Icon, MailIcon, ShieldCheckIcon, Undo2Icon } from 'lucide-react'
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

const TERMS_STATS = [
    {
        title: 'Approvals are final',
        icon: CheckCircle2Icon,
        label: 'One decision',
        description:
            "A reviewed request can't be re-opened — the database enforces it, not just the interface.",
    },
    {
        title: 'One account per person',
        icon: MailIcon,
        label: 'Unique email',
        description: 'Each account maps to one work email and one team membership.',
    },
    {
        title: 'Provided as-is',
        icon: ShieldCheckIcon,
        label: 'No warranty',
        description: 'The service is offered without guarantee of uninterrupted availability.',
    },
    {
        title: 'Leaving',
        icon: Undo2Icon,
        label: 'Records end with you',
        description: 'When your account is removed, your personal data goes with it.',
    },
]

export const TERMS_SECTIONS: LegalPolicySection[] = [
    {
        number: '01',
        id: 'acceptance',
        title: 'Acceptance of these terms',
        reference: 'TRM-101',
        paragraphs: [
            'By creating an account or using Time Off Planner ("the Service"), you ' +
                'agree to these terms on behalf of yourself and, if you are a manager, ' +
                "for the decisions you make on your team's behalf.",
            'If you do not agree, do not use the Service.',
        ],
        clauses: [
            {
                code: 'Scope // 1.1',
                title: 'Who these terms bind',
                body:
                    'These terms govern the individual account holder. The organization that provisions accounts is ' +
                    'responsible for informing its members and for the accounts it creates.',
            },
        ],
    },
    {
        number: '02',
        id: 'your-account',
        title: 'Your account',
        reference: 'TRM-102',
        paragraphs: [
            'Accounts are personal: one account per person, tied to one work email ' +
                'and one team. You are responsible for keeping your credentials ' +
                'confidential and for the activity that happens under your account.',
        ],
        clauses: [
            {
                code: 'Roles // 2.1',
                title: 'What each role can do',
                body:
                    "Members submit leave requests and view their team's calendar. Managers additionally " +
                    "approve or reject their own team's requests. These capabilities are enforced by the " +
                    'system and cannot be exercised across teams.',
            },
            {
                code: 'Security // 2.2',
                title: 'Report compromises',
                body:
                    'If you believe your account has been accessed by someone else, report it ' +
                    'to [operator contact] immediately. Sessions expire automatically after 15 minutes ' +
                    'of token lifetime to limit exposure.',
            },
        ],
    },
    {
        number: '03',
        id: 'acceptable-use',
        title: 'Using the service',
        reference: 'TRM-103',
        paragraphs: [
            'Use the Service for its purpose: requesting, approving, and tracking ' +
                "leave within your team. Don't attempt to access other teams' data, " +
                'automate the Service outside its intended interface, or interfere ' +
                'with its operation.',
        ],
        clauses: [
            {
                code: 'Limits // 3.1',
                title: 'Rate limiting',
                body:
                    'Automated abuse protection applies to sign-in and signup endpoints. Accounts or ' +
                    'addresses generating abusive traffic may be temporarily blocked without notice.',
            },
        ],
    },
    {
        number: '04',
        id: 'reviews-and-records',
        title: 'Reviews and records',
        reference: 'TRM-104',
        paragraphs: [
            'Leave requests are decided by a manager of your team. A review — ' +
                'approval or rejection — is final: it cannot be re-opened or ' +
                "re-decided, and it is recorded with the reviewer's identity and, " +
                'if given, their note.',
        ],
        clauses: [
            {
                code: 'Corrections // 4.1',
                title: 'If a decision was wrong',
                body:
                    'Submit a new request with corrected dates or discuss the decision with your manager. ' +
                    'The system deliberately does not allow editing or reversing a recorded decision — ' +
                    "the record's integrity is the point of the tool.",
            },
            {
                code: 'Balances // 4.2',
                title: 'Balance deduction',
                body:
                    "Approval deducts the request's working days from your balance at the moment of approval. " +
                    'Rejection deducts nothing. Weekends are never counted; public holidays are not handled ' +
                    'automatically — check the team calendar before requesting.',
            },
        ],
    },
    {
        number: '05',
        id: 'availability',
        title: 'Availability and changes',
        reference: 'TRM-105',
        paragraphs: [
            'The Service is provided as-is, without warranty of uninterrupted ' +
                'availability. We may add, change, or remove features, and will ' +
                'update these terms when we do — the version date at the top of ' +
                'this page reflects the current terms.',
        ],
    },
    {
        number: '06',
        id: 'termination-liability',
        title: 'Ending the relationship & liability',
        reference: 'TRM-106',
        paragraphs: [
            'Your account can be deactivated by your organization; when it is, ' +
                'your access ends and your personal data is handled as described in ' +
                'the Privacy Policy. To the maximum extent permitted by law, the ' +
                'operator is not liable for indirect or consequential damages ' +
                'arising from use of the Service, and total liability is limited to ' +
                '[amount — e.g. fees paid in the last 12 months, or €0 for a free ' +
                'internal tool].',
        ],
        clauses: [
            {
                code: 'Law // 6.1',
                title: 'Governing law',
                body: 'These terms are governed by the laws of [jurisdiction].',
            },
        ],
    },
]

const SECTION_LINKS: LegalSectionLink[] = TERMS_SECTIONS.map((s) => ({
    number: s.number,
    title: s.title.split(',')[0],
    anchor: s.id,
    reference: `§ ${s.number}.0`,
}))

const TermsPage = () => {
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
                            Official Terms
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col space-y-8 max-w-4xl">
                        <Text variant="xs" className="uppercase tracking-wider">
                            [ Codex Statutory ]
                        </Text>
                        <div>
                            <Text variant="h1"> Terms of Service.</Text>
                            <Text
                                variant="p"
                                className="text-[16px] text-muted-foreground leading-relaxed"
                            >
                                The rules for using Time Off Planner — accounts, reviews, records,
                                and what you can expect from the service.
                            </Text>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
                    {TERMS_STATS.map((stat) => (
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
                        <LegalDocumentCard sections={TERMS_SECTIONS} />
                    </main>
                </div>
            </Wrapper>
        </SafeArea>
    )
}
export default TermsPage
