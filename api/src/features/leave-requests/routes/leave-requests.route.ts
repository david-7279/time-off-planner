// src/features/leave-requests/routes/leave-request.route.ts

import { Router } from "express";
import { authenticateMiddleware } from "../../../core/middlewares/authentication.middleware.js";
import { authorize } from "../../../core/middlewares/authorization.middleware.js";
import { validationMiddleware } from "../../../core/middlewares/validation.middleware.js";
import {
  createLeaveRequest,
  getMyLeaveRequest,
  listMyLeaveRequests,
  reviewLeaveRequest,
} from "../controller/leave-request.controller.js";
import {
  createLeaveRequestValidator,
  listRequestsValidator,
  reviewLeaveRequestValidator,
} from "../validator/leave-request.validator.js";

const leaveRequestsRoute = Router();

/**
 * POST - Create a leave request.
 * Any authenticated user may create a leave request.
 */
leaveRequestsRoute.post(
  "/",
  authenticateMiddleware,
  authorize("member", "manager"),
  createLeaveRequestValidator,
  validationMiddleware,
  createLeaveRequest
);

/**
 * PATCH /:id - Review a leave request.
 * Only manager can review the leave request.
 */
leaveRequestsRoute.patch(
  "/:id",
  authenticateMiddleware,
  authorize("manager"),
  reviewLeaveRequestValidator,
  validationMiddleware,
  reviewLeaveRequest
);

/**
 * GET /me - List the leave requests for the authenticated user.
 * Any authenticated user may list their own leave requests.
 */
leaveRequestsRoute.get(
  "/me",
  authenticateMiddleware,
  listRequestsValidator,
  validationMiddleware,
  listMyLeaveRequests
);

/**
 * GET /id - A single leave request for the authenticated user.
 * Any authenticated user may list their own leave requests.
 */
leaveRequestsRoute.get("/:id", authenticateMiddleware, getMyLeaveRequest);

export default leaveRequestsRoute;
