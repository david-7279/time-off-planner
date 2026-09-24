// src/(features)/(planner)/ui/layout/components/aside-header.tsx

import { ShredderIcon } from 'lucide-react'

const AsideHeader = () => {
    return (
        <div className="flex p-4">
            <div className="flex items-center gap-4 hover:bg-border/30 rounded-xl p-2 w-full">
                <ShredderIcon size={32} />

                <div className="min-w-0 text-left">
                    <p className="truncate text-sm font-semibold">Time Off Planner</p>
                    <p className="truncate text-xs text-muted-foreground">Back Office</p>
                </div>
            </div>
        </div>
    )
}
export default AsideHeader
