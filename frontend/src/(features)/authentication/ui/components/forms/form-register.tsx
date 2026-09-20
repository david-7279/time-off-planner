// src/(features)/authentication/ui/components/form/form-register.tsx

import { Controller } from 'react-hook-form'
import { useFormRegister } from '@/src/(features)/authentication/hooks/use-form-register.ts'
import { Button } from '@/src/components/ui/button'
import { FieldGroup } from '@/src/components/ui/field.tsx'
import { FormInput } from '@/src/components/ui/form/form-input.tsx'
import { FormRegisterPasswordInput } from '@/src/components/ui/form/form-register-password.tsx'
import { Spinner } from '@/src/components/ui/spinner.tsx'
import { Text } from '@/src/components/ui/text.tsx'

const FORM_ID = 'form-register'

/**
 * Register form — thin UI over useFormLogin.
 * All state, validation, submission, error mapping, and navigation live in
 * the hook; this component renders fields, the server error banner, and
 * the submit control in its three states (idle, submitting, failed).
 */
export function FormRegister() {
    const { control, handleSubmit, onSubmit, isSubmitting, serverError } = useFormRegister()

    return (
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate>
            {serverError && (
                <div role="alert" className="text-destructive mb-4 text-sm">
                    {serverError}
                </div>
            )}

            <FieldGroup>
                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormInput
                            title="Name"
                            field={field}
                            inputId="form-login-name"
                            placeholder="Enter your name"
                            type="text"
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormInput
                            title="Email"
                            field={field}
                            inputId="form-login-email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            type="email"
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormRegisterPasswordInput
                            title="Password"
                            field={field}
                            inputId="form-register-password"
                            placeholder="Enter your password"
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="rounded-md"
                >
                    {isSubmitting && <Spinner className="size-4" />}
                    <Text variant="small" className="text-primary-foreground">
                        Sign Up
                    </Text>
                </Button>
            </FieldGroup>
        </form>
    )
}
