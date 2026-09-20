// src/features/leave-requests/types/leave-request.types.ts

import type { leaveRequests } from "../../../core/database/schema/index.js";
import type { LeaveRequestResponse } from "../dto/response/leave-request.response.js";

export const LEAVE_REQUEST_STATUSES = ["pending", "approved", "rejected"] as const;
export type LeaveRequestStatus = (typeof LEAVE_REQUEST_STATUSES)[number];

export const DEFAULT_LEAVE_REQUEST_STATUS: LeaveRequestStatus = "pending";

export type LeaveRequestRow = typeof leaveRequests.$inferSelect;

export type LeaveRequestWithType = LeaveRequestRow & {
  leaveTypeName: string;
  leaveTypePublicId: string;
};

export type LeaveRequestWithReviewer = LeaveRequestRow & {
  reviewerPublicId: string | null;
};

export type SortField = "startsAt" | "createdAt" | "status";

export type ListMyRequestsQuery = {
  page: number;
  pageSize: number;
  sortBy?: SortField;
  sortDirection?: "asc" | "desc";
  status?: LeaveRequestRow["status"];
};

export type PaginatedRequests = {
  items: LeaveRequestResponse[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};
