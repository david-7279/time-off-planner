// src/router/app-router.tsx
import { Route, Routes } from 'react-router'
import LandingPage from '@/src/(default)/landing/ui/page.tsx'
import { AppLayout } from '@/src/(default)/layout.tsx'
import PrivacyPage from '@/src/(default)/legal/ui/privacy/page.tsx'
import TermsPage from '@/src/(default)/legal/ui/terms/page.tsx'
import ManagerApprovalsPage from '@/src/(features)/(planner)/approvals/ui/page.tsx'
import MyBalancesPage from '@/src/(features)/(planner)/balances/ui/page.tsx'
import PlannerLayout from '@/src/(features)/(planner)/dashboard/ui/layout.tsx'
import { PlannerDashboardPage } from '@/src/(features)/(planner)/dashboard/ui/page.tsx'
import TeamCalendarPage from '@/src/(features)/(planner)/team-calendar/ui/page.tsx'
import AuthLayout from '@/src/(features)/authentication/ui/layout.tsx'
import AuthenticationPage from '@/src/(features)/authentication/ui/page.tsx'
import NotFoundPage from '@/src/not-found.tsx'
import { GuestRouter } from '@/src/router/guest-router.tsx'
import { paths } from '@/src/router/paths.ts'
import { ProtectedRouter } from '@/src/router/protected-router.tsx'
import MyRequestsPage from '@/src/router/ui/page.tsx'

/**
 * Route map:
 *   AppLayout (shell + reveal footer) wraps everything.
 *     ├─ public:     landing, legal documents — no gate
 *     ├─ GuestRouter: /auth (AuthLayout + tabbed auth page) — authed users → root
 *     └─ ProtectedRouter: /planner/* (PlannerLayout + 5 pages) — guests → login
 * Layout nesting is shell → gate → page; matching is by specificity.
 */
export default function AppRouter() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {/* Public */}
                <Route path={paths.public.root} element={<LandingPage />} />
                <Route path={paths.public.terms} element={<TermsPage />} />
                <Route path={paths.public.privacy} element={<PrivacyPage />} />

                {/* Guest-only */}
                <Route element={<GuestRouter />}>
                    <Route path={paths.auth} element={<AuthLayout />}>
                        <Route index element={<AuthenticationPage />} />
                    </Route>
                </Route>

                {/* Protected planner area — layout owns the prefix, children are relative */}
                <Route element={<ProtectedRouter />}>
                    <Route path={paths.timeOff.root} element={<PlannerLayout />}>
                        <Route index element={<PlannerDashboardPage />} />
                        <Route path="dashboard" element={<PlannerDashboardPage />} />
                        <Route path="requests" element={<MyRequestsPage />} />
                        <Route path="balances" element={<MyBalancesPage />} />
                        <Route path="team-calendar" element={<TeamCalendarPage />} />
                        <Route
                            path="approvals"
                            element={<ManagerApprovalsPage />}
                            // Role note: the approvals page itself must verify
                            // role === "manager" (backend enforces it; the UI
                            // should render the no-access state for members).
                        />
                    </Route>
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}
