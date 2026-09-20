// src/main.tsx

import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from '@/src/(features)/authentication/context/authentication.provider.tsx'
import {
    clearStoredAuthToken,
    getStoredAuthToken,
} from '@/src/(features)/authentication/storage/authentication.storage.ts'
import { Toaster } from '@/src/components/ui/toast.tsx'
import { setTokenProvider } from '@/src/lib/api/api-client.ts'
import { queryClient } from '@/src/lib/query/query-client.ts'
import AppRouter from '@/src/router/app-router.tsx'
import './global.css'

setTokenProvider({
    get: getStoredAuthToken,
    onUnauthorized: () => {
        clearStoredAuthToken()
        window.location.href = '/auth/login'
    },
})

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('Root element "#root" not found')
}

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <AppRouter />
                    <Toaster />
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>,
)
