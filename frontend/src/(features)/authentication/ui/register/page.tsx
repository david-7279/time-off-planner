// src/(default)/authentication/ui/register/page.tsx

import { Link } from 'react-router'
import { FormRegister } from '@/src/(features)/authentication/ui/components/forms/form-register.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Card, CardContent } from '@/src/components/ui/card.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { paths } from '@/src/router/paths.ts'

const RegisterPage = () => {
    return (
        <SafeArea className="items-center justify-center">
            <Wrapper className="flex w-full max-w-sm flex-col gap-6 py-10">
                <div>
                    <Text variant="h5">Time Off Planner</Text>
                    <Text variant="xs">Sign up to manage your time off requests</Text>
                </div>

                <main>
                    <Card className="rounded-md shadow-xs">
                        <CardContent>
                            <FormRegister />
                        </CardContent>
                    </Card>
                </main>

                <Text variant="xs" className="text-center">
                    Already have an account?{' '}
                    <Link
                        to={paths.auth.login}
                        className="font-medium underline underline-offset-2"
                    >
                        Sign In
                    </Link>
                </Text>

                <Text variant="xs">
                    By creating an account you agree to our{' '}
                    <Link to={paths.public.terms} className="underline underline-offset-2">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to={paths.public.privacy} className="underline underline-offset-2">
                        Privacy Policy
                    </Link>
                </Text>
            </Wrapper>
        </SafeArea>
    )
}
export default RegisterPage
