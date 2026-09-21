// src/(default)/legal/ui/components/legal-stat-card.tsx

import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { cn } from '@/src/lib/utils'

interface LegalStatProps {
    title: string
    label: string
    description?: string
    icon?: LucideIcon
    className?: string
}

const LegalStatCard = ({ title, icon: Icon, label, description, className }: LegalStatProps) => {
    return (
        <Card className={cn('py-5', className)}>
            <CardHeader className="flex flex-row justify-between items-center gap-2 text-muted-foreground">
                <Text variant="xs" className="uppercase tracking-widest text-muted-foreground">
                    {title}
                </Text>
                {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden="true" />}
            </CardHeader>

            <CardContent className="space-y-2">
                <p className="font-display mt-2 text-4xl font-medium tabular-nums">{label}</p>
                {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}
export default LegalStatCard
