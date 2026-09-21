// src/(features)/authentication/ui/page.tsx

import { Link } from 'react-router'
import { FormLogin } from '@/src/(features)/authentication/ui/components/forms/form-login.tsx'
import { FormRegister } from '@/src/(features)/authentication/ui/components/forms/form-register.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { CardFooter } from '@/src/components/ui/card'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card.tsx'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    TabsTriggerLabel,
} from '@/src/components/ui/tabs.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { paths } from '@/src/router/paths.ts'

/**
 * Authentication page — one paper column: running head, headline block,
 * the black tab band (the page's single bold element), the active form,
 * and one line of legal text. No chrome beyond two hairlines.
 */
export default function AuthenticationPage() {
    return (
        <SafeArea className="items-center justify-center">
            <Wrapper className="flex w-full max-w-xl flex-col gap-0 py-10">
                <Card className="border border-border p-0">
                    <CardHeader className="flex items-center justify-between bg-accent border-b border-border p-6">
                        <Text variant="xs" className="font-medium uppercase">
                            Time Off Planner
                        </Text>
                        <Text variant="xs" className="uppercase">
                            Personnel ledger
                        </Text>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="flex flex-col gap-2 px-6 pt-10 pb-12">
                            <Text
                                variant="xs"
                                className="uppercase tracking-widest text-muted-foreground"
                            >
                                Section A-1 · Identity verification
                            </Text>
                            <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
                                Access the record.
                            </h1>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                The team&apos;s absences, approvals, and balances — kept accurate.
                            </p>
                        </div>

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="login" className="flex flex-col items-start">
                                    <TabsTriggerLabel
                                        kicker="[Mode 1]"
                                        label="Sign In · Existing member"
                                    />
                                </TabsTrigger>
                                <TabsTrigger value="register" className="flex flex-col items-start">
                                    <TabsTriggerLabel
                                        kicker="[Mode 2]"
                                        label="Enroll · Create member"
                                    />
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="login" className="px-6 pt-8 pb-10">
                                <FormLogin />
                            </TabsContent>

                            <TabsContent value="register" className="px-6 pt-8 pb-10">
                                <FormRegister />

                                <p className="text-muted-foreground mt-6 border-t border-border pt-4 text-xs">
                                    By registering you agree to our{' '}
                                    <Link
                                        to={paths.public.terms}
                                        className="underline underline-offset-2 hover:text-foreground"
                                    >
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link
                                        to={paths.public.privacy}
                                        className="underline underline-offset-2 hover:text-foreground"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </TabsContent>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="bg-accent border-t border-border p-6">
                        <Text variant="xs" className="text-foreground/70">
                            All entries are attributed and reviewable by your team.
                        </Text>
                    </CardFooter>
                </Card>
            </Wrapper>
        </SafeArea>
    )
}
