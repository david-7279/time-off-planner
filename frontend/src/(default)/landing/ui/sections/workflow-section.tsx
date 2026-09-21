// src/(default)/landing/ui/sections/workflow-section.tsx

import Wrapper from '@/src/components/shared/wrapper.tsx'
import { WORKFLOW } from '../../content/landing.content.ts'

export function WorkflowSection() {
    return (
        <section
            id="how-it-works"
            aria-labelledby="workflow-heading"
            className="border-b border-border bg-muted/40 py-16"
        >
            <Wrapper>
                <div className="mb-10 border-b border-border pb-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {WORKFLOW.kicker}
                    </p>
                    <h2
                        id="workflow-heading"
                        className="font-display mt-1 text-3xl font-medium tracking-tight md:text-4xl"
                    >
                        {WORKFLOW.heading}
                    </h2>
                </div>

                {/* Three divided panels — divide-x, no cards-in-cards */}
                <div className="grid grid-cols-1 divide-y border border-border bg-background lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                    {WORKFLOW.steps.map((step) => (
                        <article
                            key={step.tier}
                            className="flex flex-col justify-between p-6 lg:p-8"
                        >
                            <div>
                                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {step.tier}
                                    </span>
                                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                                        {step.code}
                                    </span>
                                </div>
                                <h3 className="font-display text-2xl font-medium tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    {step.body}
                                </p>

                                {/* Facts table — label/value pairs, hairline-topped */}
                                <dl className="mt-6 space-y-2 border-t border-border pt-4 text-xs">
                                    {step.facts.map(([label, value]) => (
                                        <div key={label} className="flex justify-between gap-4">
                                            <dt className="uppercase tracking-widest text-muted-foreground">
                                                {label}
                                            </dt>
                                            <dd className="text-right font-medium">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <p className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-xs uppercase tracking-widest text-muted-foreground">
                                <span aria-hidden="true" className="size-1.5 bg-foreground" />
                                {step.footnote}
                            </p>
                        </article>
                    ))}
                </div>
            </Wrapper>
        </section>
    )
}
