// src/(default)/authentication/ui/login/page.tsx

import { Link } from 'react-router'
import { FormLogin } from '@/src/(features)/authentication/ui/components/forms/form-login.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Card, CardContent } from '@/src/components/ui/card.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { paths } from '@/src/router/paths.ts'

const LoginPage = () => {
    return (
        <SafeArea className="items-center justify-center">
            <Wrapper className="flex w-full max-w-sm flex-col gap-6 py-10">
                <header className="w-full">
                    <Text variant="h5">Time Off Planner</Text>
                    <Text variant="xs">Sign in to manage your time off requests</Text>
                </header>

                <main className="w-full">
                    <Card className="shadow-xs rounded-md">
                        <CardContent>
                            <FormLogin />
                        </CardContent>
                    </Card>
                </main>

                <Text variant="xs" className="text-center">
                    Don&apos;t have an account?{' '}
                    <Link
                        to={paths.auth.register}
                        className="font-medium underline underline-offset-2"
                    >
                        Create an account
                    </Link>
                </Text>
            </Wrapper>
        </SafeArea>
    )
}
export default LoginPage
