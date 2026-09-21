// src/(default)/landing/ui/sections/landing-header.tsx

import { Link } from 'react-router'
import { LANDING_HEADER } from '@/src/(default)/landing/content/landing.content.ts'
import Wrapper from '@/src/components/shared/wrapper.tsx'

const LandingHeader = () => {
    return (
        <Wrapper className="flex items-center justify-between py-4">
            <nav aria-label="Landing sections" className="flex items-center gap-6">
                {LANDING_HEADER.nav.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-2"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </Wrapper>
    )
}
export default LandingHeader
