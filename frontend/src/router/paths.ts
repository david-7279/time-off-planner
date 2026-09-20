// src/router/paths.ts

export const paths = {
    // root
    timeOff: {
        root: '/',
    },

    // authentication
    auth: {
        login: '/auth/login',
        register: '/auth/register',
    },

    // public
    public: {
        privacy: '/privacy',
        terms: '/terms',
    },

    // other
    notFound: '/notFound',
} as const
