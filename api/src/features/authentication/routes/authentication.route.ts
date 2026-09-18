import { Router } from "express";
import { authenticate } from "../../../core/middlewares/authentication.middleware.js";
import { validate } from "../../../core/middlewares/validation.middleware.js";
import { login, me, register } from "../controller/authentication.controller.js";
import { loginValidator, registerValidator } from "../validator/authentication.validator.js";

const authenticationRoute = Router();

authenticationRoute.post("/register", registerValidator, validate, register);
authenticationRoute.post("/login", loginValidator, validate, login);

authenticationRoute.get("/me", authenticate, me);

export default authenticationRoute;
