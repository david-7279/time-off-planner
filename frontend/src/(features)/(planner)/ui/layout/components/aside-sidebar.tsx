// src/(features)/(planner)/ui/layout/components/aside-sidebar.tsx

import {
    CalendarIcon,
    CheckCheckIcon,
    FileTextIcon,
    LayoutDashboardIcon,
    type LucideIcon,
    MoveRightIcon,
    WalletIcon,
} from 'lucide-react'
import { NavLink } from 'react-router'
import AsideHeader from '@/src/(features)/(planner)/ui/layout/components/aside-header.tsx'
import { useAuthenticatedUser } from '@/src/(features)/authentication/hooks/use-authenticated-user.ts'
import { useAuthentication } from '@/src/(features)/authentication/hooks/use-authentication.ts'
import type { UserRole } from '@/src/(features)/authentication/types/authentication.types.ts'
import { cn } from '@/src/lib/utils'
import { paths } from '@/src/router/paths.ts'

interface PlannerNavItem {
    label: string
    path: string
    icon: LucideIcon
    /** Roles allowed to see this item — undefined = all roles. */
    roles?: UserRole[]
    /** Optional static chip (display only — authz is `roles`). */
    badge?: string
}

const NAV_ITEMS: PlannerNavItem[] = [
    { label: 'Dashboard', path: paths.timeOff.dashboard, icon: LayoutDashboardIcon },
    { label: 'My Requests', path: paths.timeOff.requests, icon: FileTextIcon },
    { label: 'Team Calendar', path: paths.timeOff.teamCalendar, icon: CalendarIcon },
    { label: 'Balances', path: paths.timeOff.balances, icon: WalletIcon },
    {
        label: 'Approvals',
        path: paths.timeOff.approvals,
        icon: CheckCheckIcon,
        roles: ['manager'],
        badge: 'Mgr',
    },
]

/**
 * Planner sidebar — wordmark, role-filtered navigation, identity footer.
 * Desktop chrome: hidden below `lg` (AsideTopBar owns small screens).
 * Active item = the design system's inversion move (black block, white text).
 * NavLink sets aria-current="page" automatically.
 */
export function AsideSidebar() {
    const user = useAuthenticatedUser() // non-null — sidebar lives behind ProtectedRouter
    const { logout } = useAuthentication()

    const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user.role))

    return (
        <aside
            aria-label="Planner navigation"
            className="hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background lg:flex"
        >
            <AsideHeader />

            <nav className="flex-1 py-4">
                <ul className="flex flex-col">
                    {items.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center justify-between px-6 py-3 text-sm transition-colors',
                                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground',
                                        isActive
                                            ? 'bg-foreground font-medium text-background'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="flex items-center gap-3">
                                            <item.icon className="size-4" aria-hidden="true" />
                                            {item.label}
                                        </span>
                                        {item.badge && (
                                            <span
                                                className={cn(
                                                    'border px-1.5 py-0.5 text-[10px] uppercase tracking-widest',
                                                    isActive
                                                        ? 'border-background/40 text-background'
                                                        : 'border-border text-muted-foreground',
                                                )}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Identity + sign out — logout flips the auth state; ProtectedRouter redirects */}
            <div className="flex flex-col gap-3 border-t border-border px-6 py-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Signed in as
                </p>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {user.role}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => void logout()}
                    className="inline-flex items-center gap-1.5 self-start text-xs uppercase tracking-widest text-foreground hover:text-muted-foreground"
                >
                    Sign out
                    <MoveRightIcon className="size-3.5" aria-hidden="true" />
                </button>
            </div>
        </aside>
    )
}
