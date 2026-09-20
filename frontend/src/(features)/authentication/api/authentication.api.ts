// src/(features)/authentication/api/authentication.api.ts

import type {
    AuthenticatedUser,
    AuthenticationResponse,
    AuthSession,
    LoginPayload,
    RegisterPayload,
} from '@/src/(features)/authentication/types/authentication.types.ts'
import { http } from '@/src/lib/api/api-client.ts'
import type { ApiSuccess } from '@/src/lib/api/types/api.types.ts'

export const AuthenticationApi = {
    /**
     * Register a new user
     * @param payload The registration payload
     * @returns The authentication session
     */
    register: async (payload: RegisterPayload): Promise<AuthSession> => {
        const res = await http.post<AuthenticationResponse>('/auth/register', payload)
        return res.data.data
    },

    /**
     * Login a user
     * @param payload The login payload
     * @returns The authentication response
     */
    login: async (payload: LoginPayload): Promise<AuthSession> => {
        const res = await http.post<AuthenticationResponse>('/auth/login', payload)
        return res.data.data
    },

    /**
     * Get the current user
     * @returns The authentication response
     */
    me: async (): Promise<AuthenticatedUser> => {
        const res = await http.get<ApiSuccess<AuthenticatedUser>>('/auth/me')
        return res.data.data
    },
}
