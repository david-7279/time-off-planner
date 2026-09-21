// src/components/layout/reveal-footer.tsx

import { Link } from 'react-router'
import { HERO } from '@/src/(default)/landing/content/landing.content.ts'
import { Text } from '@/src/components/ui/text.tsx'
import { paths } from '@/src/router/paths.ts'

/**
 * Reveal footer: sticky behind page content — the page scrolls up to
 * uncover it. The PAGE (in the layout) provides the relative z-10
 * background that does the covering; this component is only the reveal.
 */
export function RevealFooter() {
    return (
        <footer className="sticky bottom-0 z-0 flex h-80 w-full items-end justify-center bg-accent border-border border-t-border">
            <div className="relative flex h-full w-full flex-col justify-between overflow-hidden px-6 py-10 md:px-12">
                {/* Link columns */}
                <nav aria-label="Footer" className="flex justify-end gap-12 md:gap-24">
                    <ul className="flex flex-col gap-2 text-sm md:text-base">
                        <li>
                            <a
                                href={HERO.secondaryCta.href}
                                className=" text-foreground hover:underline hover:underline-offset-2"
                            >
                                How it works
                            </a>
                        </li>
                    </ul>
                    <ul className="flex flex-col gap-2 text-sm md:text-base">
                        <li>
                            <Link
                                to={paths.public.terms}
                                className="hover:underline hover:underline-offset-2"
                            >
                                Terms
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={paths.public.privacy}
                                className="hover:underline hover:underline-offset-2"
                            >
                                Privacy
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* The giant wordmark — Playfair, per the design system */}
                <Text
                    aria-hidden="true"
                    className="font-display pointer-events-none -mb-6 text-[80px] leading-none font-medium sm:text-[140px] md:text-[192px]"
                >
                    time off
                </Text>
            </div>
        </footer>
    )
}
