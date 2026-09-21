// src/router/paths.ts

export const paths = {
    // time off
    timeOff: {
        dashboard: '/dashboard',
    },

    // authentication
    auth: '/auth',

    // public
    public: {
        root: '/',
        privacy: '/privacy',
        terms: '/terms',
    },

    // other
    notFound: '/notFound',
} as const
