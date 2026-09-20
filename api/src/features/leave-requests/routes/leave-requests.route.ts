// src/features/leave-requests/routes/leave-request.route.ts

import { Router } from "express";
import { authenticateMiddleware } from "../../../core/middlewares/authentication.middleware.js";
import { authorizeRole } from "../../../core/middlewares/authorization.middleware.js";
import { validationMiddleware } from "../../../core/middlewares/validation.middleware.js";
import { createLeaveRequest } from "../controller/leave-request.controller.js";
import { createLeaveRequestValidator } from "../validator/leave-request.validator.js";

const leaveRequestsRoute = Router();

leaveRequestsRoute.post(
  "/",
  authenticateMiddleware,
  authorizeRole("member", "manager"),
  createLeaveRequestValidator,
  validationMiddleware,
  createLeaveRequest
);

export default leaveRequestsRoute;
