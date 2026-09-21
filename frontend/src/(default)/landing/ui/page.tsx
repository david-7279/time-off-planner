// src/(default)/landing/ui/page.tsx

import { CtaSection } from '@/src/(default)/landing/ui/sections/cta-section.tsx'
import { HeroSection } from '@/src/(default)/landing/ui/sections/hero-section.tsx'
import { ModulesSection } from '@/src/(default)/landing/ui/sections/modules-section.tsx'
import { WorkflowSection } from '@/src/(default)/landing/ui/sections/workflow-section.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'

/**
 * Landing page — pure composition. All copy in landing.content.ts,
 * all structure in the section components, all styling via tokens.
 */
export default function LandingPage() {
    return (
        <SafeArea>
            <main className="px-1">
                <HeroSection />
                <WorkflowSection />
                <ModulesSection />
                <CtaSection />
            </main>
        </SafeArea>
    )
}
