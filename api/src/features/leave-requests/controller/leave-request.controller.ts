// src/features/leave-requests/controller/leave-request.controller.ts

import type { NextFunction, Request, Response } from "express";
import type { LeaveRequestRow } from "../../../core/database/schema/index.js";
import { getAuthUser } from "../../../core/middlewares/require-authenticated-user.js";
import { toCreateLeaveRequestInput } from "../dto/request/create-leave-requests.request.js";
import { toReviewLeaveRequestInput } from "../dto/request/review-leave-requests.request.js";
import * as leaveRequestService from "../service/leave-request.service.js";
import type { SortField } from "../types/leave-request.types.js";

/**
 * Creates a new leave request.
 * @param req The request object.
 * @param res The response object.
 * @param next The next function.
 * @returns The created leave request.
 */
export const createLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = toCreateLeaveRequestInput(req.body);
    if (!input) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid request body" },
      });
    }

    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }

    const { request, balanceProjection } = await leaveRequestService.createRequest(input, user.id);

    return res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      data: { request, balanceProjection },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Updates the review of a leave request.
 * @param req The request object.
 * @param res The response object.
 * @param next The next function.
 * @returns The updated leave request.
 */
export const reviewLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = toReviewLeaveRequestInput(req.body);
    if (!input) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid request body" },
      });
    }

    const raw = req.params.id;
    const requestPublicId = Array.isArray(raw) ? raw[0] : raw;

    const reviewer = getAuthUser(req);

    if (!reviewer) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }

    const { request } = await leaveRequestService.reviewRequest(requestPublicId, input, reviewer);

    return res.status(200).json({
      success: true,
      message: "Leave request review updated successfully",
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lists the leave requests for the authenticated user.
 * @param req The request object.
 * @param res The response object.
 * @param next The next function.
 * @returns The list of leave requests for the authenticated user.
 */
export const listMyLeaveRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }

    const result = await leaveRequestService.listMyRequests(user, {
      page: Number(req.query.page ?? 1),
      pageSize: Number(req.query.pageSize ?? 10),
      sortBy: req.query.sortBy as SortField | undefined,
      sortDirection: req.query.sortDirection as "asc" | "desc" | undefined,
      status: req.query.status as LeaveRequestRow["status"] | undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Leave requests listed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lists a single leave request for the authenticated user.
 * @param req The request object.
 * @param res The response object.
 * @param next The next function.
 * @returns A single leave request for the authenticated user.
 */
export const getMyLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getAuthUser(req);

    const raw = req.params.id;
    const requestPublicId = Array.isArray(raw) ? raw[0] : raw;

    const request = await leaveRequestService.getMyRequest(requestPublicId, user);

    return res.status(200).json({
      success: true,
      message: "Leave request retrieved successfully",
      data: { request },
    });
  } catch (error) {
    return next(error);
  }
};
