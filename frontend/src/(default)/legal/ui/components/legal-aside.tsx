// src/(default)/legal/ui/components/legal-aside.tsx

import { cn } from '@/src/lib/utils'

export type LegalSectionLink = {
    number: string
    title: string
    anchor: string
    reference?: string
}

interface LegalAsideProps {
    title?: string
    /** Unit noun for the count badge — "NODES", "SECTIONS", "CLAUSES"… */
    countLabel?: string
    sections: LegalSectionLink[]
    className?: string
}

export function LegalAside({
    title = 'Codex Sections',
    countLabel = 'nodes',
    sections,
    className,
}: LegalAsideProps) {
    return (
        <nav
            aria-label="Policy sections"
            className={cn('flex flex-col ring-1 bg-card ring-foreground/5', className)}
        >
            {/* Header row: title left, count right — the [ 06 NODES ] pattern */}
            <div className="flex items-center justify-between border-b border-foreground/5 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-foreground">
                    {title}
                </p>
                <p className="text-xs tabular-nums text-muted-foreground">
                    [ {String(sections.length).padStart(2, '0')} {countLabel.toUpperCase()} ]
                </p>
            </div>

            <ul className="flex flex-col">
                {sections.map((section) => (
                    <li
                        key={section.anchor}
                        className="border-b border-foreground/5 last:border-b-0 even:bg-muted/50"
                    >
                        <a
                            href={`#${section.anchor}`}
                            className="group flex items-baseline justify-between gap-3 px-4 py-2.5 text-sm hover:bg-muted"
                        >
                            <span className="flex items-baseline gap-2">
                                <span className="text-xs tabular-nums text-foreground">
                                    {section.number}.
                                </span>
                                <span className="group-hover:underline group-hover:underline-offset-2">
                                    {section.title}
                                </span>
                            </span>
                            {section.reference && (
                                <span className="text-xs tabular-nums text-muted-foreground">
                                    {section.reference}
                                </span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
