import type {HelmetOptions} from "helmet";

export const helmetConfig: HelmetOptions = {
    // Restricts where resources (scripts, images, styles) can be loaded from.
    contentSecurityPolicy: {
        directives: {
            // Fallback rule: block everything by default, then selectively allow own domain.
            defaultSrc: ["'none'", "'self'"],

            // CSS: Only allow stylesheets hosted on own server. Blocks inline <style> tags.
            styleSrc: ["'self'"],

            // JavaScript: Only execute JS files hosted on own server. Blocks inline <script> tags.
            scriptSrc: ["'self'"],

            // Images: Allow local images, base64 data URIs, and blob URLs (common for file uploads/previews).
            imgSrc: ["'self'", "data:", "blob:"],

            // Clickjacking Protection: Strictly prevents other websites from embedding our app inside an <iframe>.
            frameAncestors: ["'none'"],

            // Form Submissions: Ensures HTML forms on our site can only submit data.
            formAction: ["'self'"],

            // Plugins: Completely blocks legacy, insecure plugins like Flash or Java applets.
            objectSrc: ["'none'"],

            // URL Restrictions: Restricts the DOM <base> tag to domain to prevent relative-path hijacking.
            baseUri: ["'self'"],

            // API & Network Calls: Restricts fetch, axios, and WebSockets
            connectSrc: ["'self'"],

            // Fonts: Only allow web fonts downloaded and hosted directly on our own server.
            fontSrc: ["'self'"],

            // Force HTTPS: Automatically upgrades any accidental HTTP asset requests to secure HTTPS.
            upgradeInsecureRequests: []
        },
    },

    // Tells the browser to strictly communicate with our server using ONLY HTTPS.
    strictTransportSecurity: {
        maxAge: 31536000,           // Enforce HTTPS strictly for 1 entire year (in seconds).
        includeSubDomains: true,    // Apply this strict rule to all subdomains (e.g., ://yourdomain.com).
        preload: true               // Submits our domain to the global browser hardcoded HTTPS-only list.
    },

    // Prevents other websites from reading or hotlinking our static assets (images, scripts, etc.).
    crossOriginResourcePolicy: {
        policy: "same-origin",   // Only frontend can read resources from this backend.
    },

    // Disables an old IE-specific feature that allowed files to execute automatically upon download.
    xDownloadOptions: false,
};
