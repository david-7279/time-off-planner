// src/router/protected-router.tsx

import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthentication } from '@/src/(features)/authentication/hooks/use-authentication.ts'
import { AuthGateLoading } from '@/src/components/layout/auth-gate-loading.tsx'
import { paths } from '@/src/router/paths.ts'

/** Route gate for authenticated-only pages (balances, requests, calendar) */
export function ProtectedRouter() {
    const { status, isAuthenticated } = useAuthentication()
    const location = useLocation()

    if (status === 'restoring' || status === 'loading') {
        return <AuthGateLoading />
    }

    if (!isAuthenticated) {
        return <Navigate to={paths.auth} replace state={{ from: location }} />
    }

    return <Outlet />
}
