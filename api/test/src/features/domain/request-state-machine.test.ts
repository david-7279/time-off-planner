import { describe, expect, it } from "vitest";
import { canTransition } from "../../../../src/features/domain/request-state-machine.js";

describe("requestStateMachine", () => {
  it("allows transition from pending to approved", () => {
    expect(canTransition("pending", "approved")).toBe(true);
  });

  it("allows transition from pending to rejected", () => {
    expect(canTransition("pending", "rejected")).toBe(true);
  });

  it("allows transition from approved to pending", () => {
    expect(canTransition("approved", "pending")).toBe(false);
  });

  it("allows transition from approved to rejected", () => {
    expect(canTransition("approved", "rejected")).toBe(false);
  });

  it("allows transition from rejected to pending", () => {
    expect(canTransition("rejected", "pending")).toBe(false);
  });

  it("allows transition from rejected to approved", () => {
    expect(canTransition("rejected", "approved")).toBe(false);
  });
});
