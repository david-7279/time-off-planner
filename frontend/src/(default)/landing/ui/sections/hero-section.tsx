// src/(default)/landing/ui/sections/hero-section.tsx

import { Link } from 'react-router'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { HERO, METRICS } from '../../content/landing.content.ts'

/** Full-width band, hairline-bounded: headline left, copy+CTAs right, metrics below. */
export function HeroSection() {
    return (
        <section aria-labelledby="landing-headline" className="border-b border-border">
            <Wrapper className="py-12 md:py-16">
                {/* Kicker row — one small-caps intensity, real content */}
                <div className="mb-10 flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
                    <Text className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground">
                        <span aria-hidden="true" className="inline-block size-2 bg-foreground" />
                        {HERO.kicker}
                    </Text>
                    <Text className="text-xs uppercase tracking-widest text-muted-foreground">
                        Personnel ledger · 2026
                    </Text>
                </div>

                {/* Broadsheet headline group: 8/4 split, serif dominates */}
                <div className="mb-12 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <Text
                            id="landing-headline"
                            aria-hidden="true"
                            className="font-display pointer-events-none -mb-6 text-[60px] leading-none font-medium sm:text-[100px] md:text-[120px]"
                        >
                            {HERO.headline}
                        </Text>
                    </div>
                    <div className="flex flex-col gap-6 border-t border-border pt-6 lg:col-span-4 lg:border-t-0 lg:border-l lg:border-border lg:pt-0 lg:pl-8">
                        <Text className="text-base leading-relaxed text-muted-foreground">
                            {HERO.subheadline}
                        </Text>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            {/* Primary: solid black block (inversion = the accent) */}
                            <Button className="rounded-none">
                                <Link to={HERO.primaryCta.href}>{HERO.primaryCta.label}</Link>
                            </Button>
                            {/* Secondary: hairline outline, no fill */}
                            <Button variant="outline" className="rounded-none">
                                <a href={HERO.secondaryCta.href}>{HERO.secondaryCta.label}</a>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Metrics strip — divided columns, serif numerals, tabular */}
                <dl className="grid grid-cols-1 divide-y border-y border-border bg-muted/40 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
                    {METRICS.map((metric) => (
                        <div key={metric.kicker} className="flex flex-col gap-2 p-5 lg:p-6">
                            <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                                {metric.kicker}
                            </dt>
                            <dd className="font-display text-3xl font-medium tabular-nums">
                                {metric.value}
                            </dd>
                            <dd className="text-sm text-muted-foreground">{metric.body}</dd>
                        </div>
                    ))}
                </dl>
            </Wrapper>
        </section>
    )
}
