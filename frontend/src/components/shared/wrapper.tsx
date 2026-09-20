// src/components/shared/wrapper.tsx

import type { ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

interface WrapperProps {
    className?: string
    children: ReactNode
}

/** Centered content container — width constraint + horizontal padding. */
export default function Wrapper({ className, children }: WrapperProps) {
    return (
        <div className={cn('flex flex-col mx-auto w-full max-w-4xl px-4', className)}>
            {children}
        </div>
    )
}
