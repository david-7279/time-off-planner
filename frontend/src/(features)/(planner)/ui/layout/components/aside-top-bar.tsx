// src/(features)/(planner)/ui/layout/components/aside-top-bar.tsx

import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SidebarTrigger } from '@/src/components/ui/sidebar'
import { cn } from '@/src/lib/utils'

interface DefaultSidebarTopBarProps {
    title: string
    className?: string
}

const AsideTopBar = ({ title, className }: DefaultSidebarTopBarProps) => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'sticky top-1 z-50 w-full flex shrink-0 items-center justify-between gap-2 overflow-hidden border-b border-border px-4 py-3 transition-all duration-200 md:px-6 md:py-4',
                isScrolled && 'bg-background/50 max-w-full rounded-2xl border backdrop-blur-lg',
                className,
            )}
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <SidebarTrigger className="-ml-1 md:hidden" />

                <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">
                    {title}
                </h1>
            </div>

            <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent-foreground px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-800 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
                <SlidersHorizontal size={14} className="text-white" />
            </motion.button>
        </header>
    )
}

export default AsideTopBar
