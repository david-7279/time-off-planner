// src/router/guest-router.tsx

import { Navigate, Outlet } from 'react-router'
import { useAuthentication } from '@/src/(features)/authentication/hooks/use-authentication.ts'
import { AuthGateLoading } from '@/src/components/layout/auth-gate-loading.tsx'
import { paths } from '@/src/router/paths.ts'

/** Route gate for unauthenticated-only pages (login, register) */
export function GuestRouter() {
    const { status, isAuthenticated } = useAuthentication()

    if (status === 'restoring' || status === 'loading') {
        return <AuthGateLoading />
    }

    if (isAuthenticated) {
        return <Navigate to={paths.timeOff.dashboard} replace />
    }

    return <Outlet />
}
