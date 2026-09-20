// src/core/models/types/express.d.ts

import { AuthenticatedUser } from "../../../features/authentication/types/authentication.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
