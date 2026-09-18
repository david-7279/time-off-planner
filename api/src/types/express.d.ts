import { AuthenticatedUser } from "../features/authentication/types/authentication.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
