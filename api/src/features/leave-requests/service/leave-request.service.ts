// src/features/leave-requests/service/leave-request.service.ts

import { db } from "../../../core/database/db.js";
import { AppError } from "../../../core/errors/app.error.js";
import { NotFoundError } from "../../../core/errors/not-found.error.js";
import type { AuthenticatedUser } from "../../authentication/types/authentication.types.js";
import { canTransition } from "../../domain/request-state-machine.js";
import { countWorkingDays } from "../../domain/working-days.js";
import { findBalance } from "../../leave-balance/repository/leave-balance.repository.js";
import { findLeaveTypeById } from "../../leave-types/repository/leave-types.repository.js";
import type { CreateLeaveRequest } from "../dto/request/create-leave-requests.request.js";
import type { ReviewLeaveRequest } from "../dto/request/review-leave-requests.request.js";
import {
  type LeaveRequestResponse,
  toLeaveRequestResponse,
} from "../dto/response/leave-request.response.js";
import {
  approveRequestWithDeduction,
  insertLeaveRequest,
  rejectRequest,
} from "../repository/command/command-leave-request.repository.js";
import {
  countLeaveRequests,
  type FindLeaveRequestsOptions,
  findLeaveRequests,
  findLeaveRequestWithTeam,
} from "../repository/query/query-leave-request.repository.js";
import {
  DEFAULT_LEAVE_REQUEST_STATUS,
  type ListMyRequestsQuery,
  type PaginatedRequests,
} from "../types/leave-request.types.js";

/** The result of creating a new leave request. */
export type CreateRequestResult = {
  request: LeaveRequestResponse;
  balanceProjection: { remainingBefore: number; remainingAfter: number };
};

/** The result of reviewing a leave request. */
export type ReviewRequestResult = {
  request: LeaveRequestResponse;
};

/**
 * Creates a new leave request.
 * @param input The input data for the leave request.
 * @param requesterId The ID of the user creating the request.
 * @returns The result of the leave request creation.
 */
export async function createRequest(
  input: CreateLeaveRequest,
  requesterId: number
): Promise<CreateRequestResult> {
  const leaveType = await findLeaveTypeById(input.leaveTypeId);
  if (!leaveType) {
    throw new AppError("Leave type not found", 404);
  }

  const workingDays = countWorkingDays(input.startsAt, input.endsAt);
  if (workingDays === 0) {
    throw new AppError("The selected range contains no working days", 400);
  }

  const year = Number(input.startsAt.slice(0, 4));

  const balance = await findBalance(requesterId, input.leaveTypeId, year);
  if (!balance) {
    throw new AppError(
      `No ${leaveType.name} balance exists for ${year} — contact your manager`,
      409
    );
  }

  const remainingBefore = balance.allowanceDays - balance.usedDays;
  const remainingAfter = remainingBefore - workingDays;

  const row = await insertLeaveRequest({
    userId: requesterId,
    leaveTypeId: input.leaveTypeId,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    workingDays,
    status: DEFAULT_LEAVE_REQUEST_STATUS,
  });

  return {
    request: toLeaveRequestResponse({
      ...row,
      leaveTypeName: leaveType.name,
      leaveTypePublicId: leaveType.publicId,
      reviewerPublicId: null,
    }),
    balanceProjection: { remainingBefore, remainingAfter },
  };
}

/**
 * Reviews a leave request.
 * @param requestPublicId The public ID of the leave request to review.
 * @param input The update data for the leave request.
 * @param reviewer The user reviewing the request.
 * @returns The updated leave request.
 */
export async function reviewRequest(
  requestPublicId: string,
  input: ReviewLeaveRequest,
  reviewer: { id: number; publicId: string; role: string; teamId: number | null }
): Promise<ReviewRequestResult> {
  const found = await findLeaveRequestWithTeam(requestPublicId);
  if (!found) {
    throw new AppError("Leave request not found", 404);
  }
  const { request, requesterTeamId } = found;

  if (reviewer.role !== "manager") {
    throw new AppError("Only managers can review requests", 403);
  }
  if (requesterTeamId !== reviewer.teamId) {
    throw new AppError("You can only review requests from your own team", 403);
  }
  if (request.userId === reviewer.id) {
    throw new AppError("You cannot review your own request", 403);
  }

  if (!canTransition(request.status, input.status)) {
    throw new AppError(`Request is already ${request.status}`, 409);
  }

  const leaveType = await findLeaveTypeById(request.leaveTypeId);
  if (!leaveType) {
    throw new NotFoundError("Leave type");
  }

  const result = await db.transaction(async (tx) =>
    input.status === "approved"
      ? approveRequestWithDeduction(requestPublicId, reviewer.id, input.note, tx)
      : rejectRequest(requestPublicId, reviewer.id, input.note, tx)
  );

  if ("conflict" in result) {
    throw new AppError("Request has already been reviewed", 409);
  }

  return {
    request: toLeaveRequestResponse({
      ...result.request,
      leaveTypeName: leaveType.name,
      leaveTypePublicId: leaveType.publicId,
      reviewerPublicId: reviewer.publicId,
    }),
  };
}

/**
 * Lists the leave requests for the current user.
 * @param user The current user.
 * @param query The query parameters.
 */
export async function listMyRequests(
  user: AuthenticatedUser,
  query: ListMyRequestsQuery
): Promise<PaginatedRequests> {
  const pageSize = Math.min(Math.max(query.pageSize, 1), 50);
  const page = Math.max(query.page, 1);

  const options: FindLeaveRequestsOptions = {
    userId: user.id,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    sortBy: query.sortBy,
    sortDirection: query.sortDirection,
    statuses: query.status ? [query.status] : undefined,
  };

  const [rows, totalItems] = await Promise.all([
    findLeaveRequests(options),
    countLeaveRequests(options),
  ]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    items: rows.map(toLeaveRequestResponse),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}
