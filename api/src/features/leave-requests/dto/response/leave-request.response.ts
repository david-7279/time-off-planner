import type {
  LeaveRequestStatus,
  LeaveRequestWithReviewer,
  LeaveRequestWithType,
} from "../../types/leave-request.types.js";

export type LeaveRequestResponse = {
  publicId: string;
  leaveTypePublicId: string;
  leaveTypeName: string;
  startsAt: string;
  endsAt: string;
  workingDays: number;
  status: LeaveRequestStatus;
  reviewerPublicId: string | null;
  reviewNote: string | null;
  createdAt: string;
};

export type LeaveRequestDetail = LeaveRequestWithType & LeaveRequestWithReviewer;

export function toLeaveRequestResponse(row: LeaveRequestDetail): LeaveRequestResponse {
  return {
    publicId: row.publicId,
    leaveTypePublicId: row.leaveTypePublicId,
    leaveTypeName: row.leaveTypeName,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
    workingDays: row.workingDays,
    status: row.status,
    reviewerPublicId: row.reviewerPublicId ?? null,
    reviewNote: row.reviewNote ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}
