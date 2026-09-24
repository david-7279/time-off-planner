// features/calendar/types/calendar.types.ts — COMPLETE, consolidated

import type { LeaveRequestStatus } from "../../../leave-requests/types/leave-request.types.js";

/** One team leave entry overlapping a displayed month.
 *  Wire shape — mirrors the frontend's CalendarEntry in lib/api/types exactly. */
export type CalendarEntry = {
  publicId: string;
  userPublicId: string;
  userName: string;
  leaveTypeName: string;
  startsAt: string;
  endsAt: string;
  workingDays: number;
  status: LeaveRequestStatus;
};

export type CalendarData = {
  /** Requested month window — echoed for the client's header/paging logic. */
  year: number;
  /** 1–12, matching the ?month= convention. */
  month: number;
  entries: CalendarEntry[];
};

export type CalendarQuery = {
  year: number;
  month: number;
};

/** Month selection state — the Zustand store's shape (frontend contract mirror). */
export type SelectedMonth = {
  year: number;
  month: number;
};
