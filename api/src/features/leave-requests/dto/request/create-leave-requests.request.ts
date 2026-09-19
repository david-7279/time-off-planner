export type CreateLeaveRequestRequest = {
  leaveTypeId: number;
  startsAt: string;
  endsAt: string;
};

/**
 * Maps the raw, untrusted request body to the create-request input.
 * Allow-list: only these three fields survive. Anything else the client
 * sends (status, reviewerId, workingDays, ...) is discarded HERE —
 * the service computes those itself.
 */
export function toCreateLeaveRequestInput(body: unknown): CreateLeaveRequestRequest | null {
  if (typeof body !== "object" || body === null) return null;

  const b = body as Record<string, unknown>;

  if (
    typeof b.leaveTypeId !== "number" ||
    typeof b.startsAt !== "string" ||
    typeof b.endsAt !== "string"
  ) {
    return null;
  }

  return {
    leaveTypeId: b.leaveTypeId,
    startsAt: b.startsAt,
    endsAt: b.endsAt,
  };
}
