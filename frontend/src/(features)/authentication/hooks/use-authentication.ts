// src/(features)/authentication/hooks/use-authentication.ts

import { useContext } from 'react'
import { AuthenticationContext } from '@/src/(features)/authentication/context/authentication.context.ts'

export function useAuthentication() {
    const context = useContext(AuthenticationContext)

    if (!context) {
        throw new Error('useAuth must be used inside <AuthProvider />')
    }

    return context
}
