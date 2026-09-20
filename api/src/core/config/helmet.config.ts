// src/core/config/helmet.config.ts

import type { HelmetOptions } from "helmet";

export const helmetConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'none'"],
    },
  },
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    // preload: enable at deployment once HTTPS is confirmed on all subdomains
  },
  crossOriginResourcePolicy: { policy: "same-origin" },
  xDownloadOptions: false,
};
