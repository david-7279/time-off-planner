import type { leaveRequests } from "../../../core/database/schema/index.js";

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
