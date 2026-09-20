// src/components/shared/safe-area.tsx

import type { ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

interface SafeAreaProps {
    className?: string
    children: ReactNode
}

/** Full-height flexible column — the outermost page band. */
export default function SafeArea({ className, children }: SafeAreaProps) {
    return <div className={cn('flex min-h-dvh flex-1 flex-col', className)}>{children}</div>
}
