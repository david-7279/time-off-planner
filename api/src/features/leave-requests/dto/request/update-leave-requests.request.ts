export type UpdateReviewLeaveRequest = {
  status: "approved" | "rejected";
  note?: string;
};

export function toReviewLeaveRequestInput(body: unknown): UpdateReviewLeaveRequest | null {
  if (typeof body !== "object" || body === null) return null;

  const b = body as Record<string, unknown>;

  if (b.status !== "approved" && b.status !== "rejected") return null;
  if (b.note !== undefined && typeof b.note !== "string") return null;

  return {
    status: b.status,
    note: b.note,
  };
}
