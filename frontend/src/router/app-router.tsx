// src/router/app-router.tsx

import { Route, Routes } from 'react-router'
import LandingPage from '@/src/(default)/landing/ui/page.tsx'
import { AppLayout } from '@/src/(default)/layout.tsx'
import PrivacyPage from '@/src/(default)/legal/ui/privacy/page.tsx'
import TermsPage from '@/src/(default)/legal/ui/terms/page.tsx'
import AuthLayout from '@/src/(features)/authentication/ui/layout.tsx'
import AuthenticationPage from '@/src/(features)/authentication/ui/page.tsx'
import NotFoundPage from '@/src/not-found.tsx'
import { GuestRouter } from '@/src/router/guest-router.tsx'
import { paths } from '@/src/router/paths.ts'
import { ProtectedRouter } from '@/src/router/protected-router.tsx'

/**
 * Route map:
 *  - AppLayout (shell + reveal footer) wraps everything public and protected
 *  - GuestRouter gates /auth (AuthLayout + tabbed auth page)
 *  - ProtectedRouter gates the app pages (balances, requests, calendar)
 * Route matching is by specificity, not order — but layout nesting is
 * shell → gate → page, inside-out.
 */
export default function AppRouter() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {/* Public legal documents */}
                <Route path={paths.public.root} element={<LandingPage />} />
                <Route path={paths.public.terms} element={<TermsPage />} />
                <Route path={paths.public.privacy} element={<PrivacyPage />} />

                {/* Guest-only: the auth page (login + register tabs) */}
                <Route element={<GuestRouter />}>
                    <Route path={paths.auth} element={<AuthLayout />}>
                        <Route index element={<AuthenticationPage />} />
                    </Route>
                </Route>

                {/* Protected app pages */}
                <Route element={<ProtectedRouter />}>
                    {/*<Route path={paths.timeOff.root} element={<BalancesPage />} />*/}
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}
