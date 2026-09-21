// src/(default)/legal/ui/components/legal-document-card.tsx

import { Card, CardContent } from '@/src/components/ui/card.tsx'
import { cn } from '@/src/lib/utils'

export type LegalClause = {
    code: string
    title: string
    body: string
}

export type LegalPolicySection = {
    number: string
    id: string
    title: string
    reference?: string
    paragraphs: string[]
    clauses?: LegalClause[]
}

interface LegalDocumentCardProps {
    sections: LegalPolicySection[]
    className?: string
}

export function LegalDocumentCard({ sections, className }: LegalDocumentCardProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)}>
            {sections.map((section) => (
                <Card key={section.id} id={section.id} className="scroll-mt-24 p-0 py-2">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between gap-4 px-6 pt-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background">
                                    Clause {section.number}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                                    {section.title}
                                </span>
                            </div>
                            {section.reference && (
                                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                                    Ref: {section.reference}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 px-6 pt-4">
                            <h2 className="font-display text-3xl font-medium tracking-tight">
                                {section.title}
                            </h2>
                            {section.paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-sm leading-relaxed text-foreground"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {section.clauses && section.clauses.length > 0 && (
                            <div className="mt-6 flex flex-col gap-3 px-6 pb-6">
                                {section.clauses.map((clause) => (
                                    <div key={clause.code} className="bg-accent p-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                                            <span className="shrink-0 self-start bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background sm:mt-0.5">
                                                {clause.code}
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs font-bold uppercase tracking-widest text-foreground">
                                                    {clause.title}
                                                </p>
                                                <p className="text-sm leading-relaxed text-foreground/80">
                                                    {clause.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
