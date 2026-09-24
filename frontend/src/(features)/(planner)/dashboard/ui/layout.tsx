import { Outlet } from 'react-router'
import { AsideSidebar } from '@/src/(features)/(planner)/ui/layout/components/aside-sidebar.tsx'
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar'
import { TooltipProvider } from '@/src/components/ui/tooltip'

const PlannerLayout = () => {
    return (
        <TooltipProvider>
            <SidebarProvider className="h-svh overflow-hidden">
                <AsideSidebar />
                <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <Outlet />
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}

export default PlannerLayout
