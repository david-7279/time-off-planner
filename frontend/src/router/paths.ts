// src/router/paths.ts

export const paths = {
    // root
    timeOff: {
        root: '/',
    },

    // authentication
    auth: '/auth',

    // public
    public: {
        privacy: '/privacy',
        terms: '/terms',
    },

    // other
    notFound: '/notFound',
} as const
