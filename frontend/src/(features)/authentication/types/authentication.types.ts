// src/(features)/authentication/types/authentication.types.ts

import type { ApiSuccess } from '@/src/lib/api/types/api.types.ts'

export const USER_ROLES = ['member', 'manager'] as const
export type UserRole = (typeof USER_ROLES)[number]

/**
 * Authentication lifecycle:
 *  - restoring: boot with a stored token, /auth/me in flight — route guards WAIT
 *  - loading:   a login/register call is in flight
 *  - authenticated / unauthenticated: settled states
 */
export type AuthenticationStatus = 'restoring' | 'loading' | 'authenticated' | 'unauthenticated'

export type LoginPayload = {
    email: string
    password: string
}

export type RegisterPayload = {
    name: string
    email: string
    password: string
}

/** Verify field-by-field against the real login response in the API documentation. */
export type AuthToken = {
    accessToken: string
}

/** Field-by-field transcription of the backend's /auth/me user payload. */
export type AuthenticatedUser = {
    publicId: string
    name: string
    email: string
    role: UserRole
    teamId: number | null
}

/** The session payload — arrives INSIDE the ApiSuccess envelope. */
export type AuthSession = {
    user: AuthenticatedUser
    token: AuthToken
}

/** What the wire actually carries on login/register success. */
export type AuthenticationResponse = ApiSuccess<AuthSession>

export type AuthenticationContextValue = {
    status: AuthenticationStatus
    user: AuthenticatedUser | null
    token: string | null
    isAuthenticated: boolean
    login: (payload: LoginPayload) => Promise<void>
    register: (payload: RegisterPayload) => Promise<void>
    logout: () => Promise<void>
}

export const AUTH_TOKEN_STORAGE_KEY = 'time-off:authentication:token'
