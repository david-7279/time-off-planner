import { Router } from "express";
import { authenticateMiddleware } from "../../../core/middlewares/authentication.middleware.js";
import { validationMiddleware } from "../../../core/middlewares/validation.middleware.js";
import { login, me, register } from "../controller/authentication.controller.js";
import { loginValidator, registerValidator } from "../validator/authentication.validator.js";

const authenticationRoute = Router();

authenticationRoute.post("/register", registerValidator, validationMiddleware, register);

authenticationRoute.post("/login", loginValidator, validationMiddleware, login);

authenticationRoute.get("/me", authenticateMiddleware, me);

export default authenticationRoute;
