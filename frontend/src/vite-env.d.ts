/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Backend API origin, e.g. "http://localhost:3000" (no trailing slash). */
    readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
