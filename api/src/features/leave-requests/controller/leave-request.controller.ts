// src/features/leave-requests/controller/leave-request.controller.ts

import type { NextFunction, Request, Response } from "express";
import { getAuthUser } from "../../../core/middlewares/require-authenticated-user.js";
import { toCreateLeaveRequestInput } from "../dto/request/create-leave-requests.request.js";
import * as leaveRequestService from "../service/leave-request.service.js";

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
