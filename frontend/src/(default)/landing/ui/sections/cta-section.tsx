// src/(default)/landing/ui/sections/cta-section.tsx

import { Link } from 'react-router'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { CTA } from '../../content/landing.content.ts'

/** The one full-inversion moment on the page: black band, white type. */
export function CtaSection() {
    return (
        <section aria-labelledby="cta-heading" className="bg-foreground text-background">
            <Wrapper className="flex flex-col gap-6 py-16 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                    <Text variant="xs" className="uppercase tracking-widest opacity-70">
                        {CTA.kicker}
                    </Text>
                    <h2
                        id="cta-heading"
                        className="font-display mt-2 text-4xl font-medium tracking-tight md:text-5xl"
                    >
                        {CTA.headline}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed opacity-80">{CTA.body}</p>
                </div>
                {/* On black: the button inverts again — white block, black text */}
                <Button
                    variant="outline"
                    className="shrink-0 rounded-none border-background bg-background text-foreground hover:bg-background/90"
                >
                    <Link to={CTA.button.href}>{CTA.button.label}</Link>
                </Button>
            </Wrapper>
        </section>
    )
}
