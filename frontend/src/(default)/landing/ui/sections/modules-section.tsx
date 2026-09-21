// src/(default)/landing/ui/sections/modules-section.tsx

import { Link } from 'react-router'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    TabsTriggerLabel,
} from '@/src/components/ui/tabs.tsx'
import { paths } from '@/src/router/paths.ts'
import { MODULES } from '../../content/landing.content.ts'

export function ModulesSection() {
    return (
        <section
            id="modules"
            aria-labelledby="modules-heading"
            className="border-b border-border py-16"
        >
            <Wrapper>
                <div className="mb-10 border-b border-border pb-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {MODULES.kicker}
                    </p>
                    <h2
                        id="modules-heading"
                        className="font-display mt-1 text-3xl font-medium tracking-tight md:text-4xl"
                    >
                        {MODULES.heading}
                    </h2>
                </div>

                {/* Your accessible Tabs primitive — the Stitch inline-JS version,
                    replaced. Active = inverted black block, per the design system. */}
                <Tabs defaultValue={MODULES.items[0].value} className="w-full">
                    <TabsList className="w-full max-sm:flex-col">
                        {MODULES.items.map((item) => (
                            <TabsTrigger
                                key={item.value}
                                value={item.value}
                                className="flex flex-col items-start"
                            >
                                <TabsTriggerLabel kicker={item.kicker} label={item.title} />
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {MODULES.items.map((item) => (
                        <TabsContent
                            key={item.value}
                            value={item.value}
                            className="border border-border p-8"
                        >
                            <h3 className="font-display text-2xl font-medium tracking-tight">
                                {item.title}
                            </h3>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                {item.body}
                            </p>
                            {/* Each module deep-links to its real screen (or auth for guests) */}
                            <Link
                                to={paths.auth}
                                className="mt-6 inline-block border-b border-foreground pb-0.5 text-sm font-medium hover:no-underline"
                            >
                                Open the app →
                            </Link>
                        </TabsContent>
                    ))}
                </Tabs>
            </Wrapper>
        </section>
    )
}
