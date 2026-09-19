import type {LeaveRequestStatus} from "../leave-requests/types/leave-request.types.js";

/**
 * Returns true if a leave request can transition from one status to another.
 * @param from The current status of the leave request.
 * @param to The desired status of the leave request.
 * @returns True if the transition is allowed, false otherwise.
 */
const ALLOWED_TRANSITIONS: Record<LeaveRequestStatus, readonly LeaveRequestStatus[]> = {
    pending: ["approved", "rejected"],
    approved: [],
    rejected: [],
};

/**
 * Checks if a leave request can transition from one status to another.
 * @param from The current status of the leave request.
 * @param to The desired status of the leave request.
 * @returns True if the transition is allowed, false otherwise.
 */
export function canTransition(from: LeaveRequestStatus, to: LeaveRequestStatus): boolean {
    return ALLOWED_TRANSITIONS[from].includes(to);
}
