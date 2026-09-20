// src/router/app-router.tsx

import { Navigate, Route, Routes } from 'react-router'
import PrivacyPage from '@/src/(default)/legal/ui/privacy/page.tsx'
import TermsPage from '@/src/(default)/legal/ui/terms/page.tsx'
import AuthLayout from '@/src/(features)/authentication/ui/layout.tsx'
import LoginPage from '@/src/(features)/authentication/ui/login/page.tsx'
import RegisterPage from '@/src/(features)/authentication/ui/register/page.tsx'
import NotFoundPage from '@/src/not-found.tsx'
import { GuestRouter } from '@/src/router/guest-router.tsx'
import { paths } from '@/src/router/paths.ts'
import { ProtectedRouter } from '@/src/router/protected-router.tsx'

/**
 * Route map. Three groups, each behind its gate:
 *  - public:    legal pages, no auth gate
 *  - guest:     auth pages inside AuthLayout — authenticated users are redirected out
 *  - protected: app pages — unauthenticated users are redirected to login
 */
export default function AppRouter() {
    return (
        <Routes>
            {/* Public */}
            <Route path={paths.public.terms} element={<TermsPage />} />
            <Route path={paths.public.privacy} element={<PrivacyPage />} />

            {/* Guest-only */}
            <Route element={<GuestRouter />}>
                <Route path="/auth" element={<AuthLayout />}>
                    <Route index element={<Navigate to={paths.auth.login} replace />} />
                    <Route path={paths.auth.login} element={<LoginPage />} />
                    <Route path={paths.auth.register} element={<RegisterPage />} />
                </Route>
            </Route>

            {/* Protected (authenticated) */}
            <Route element={<ProtectedRouter />}>
                {/*<Route path={paths.timeOff.root} element={<BalancesPage />} />*/}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}
