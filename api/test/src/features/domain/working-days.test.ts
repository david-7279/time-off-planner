import { describe, expect, it } from "vitest";
import { countWorkingDays } from "../../../../src/features/domain/working-days.js";

describe("countWorkingDays", () => {
  it("counts Mon–Fri as 5", () => {
    expect(countWorkingDays("2026-01-05", "2026-01-09")).toBe(5);
  });

  it("excludes weekends inside the range (Mon–Sun = 5)", () => {
    expect(countWorkingDays("2026-01-05", "2026-01-11")).toBe(5);
  });

  it("counts a range containing a mid-week weekend (Thu–Mon = 3)", () => {
    expect(countWorkingDays("2026-01-08", "2026-01-12")).toBe(3);
  });

  it("counts a single working day", () => {
    expect(countWorkingDays("2026-01-09", "2026-01-09")).toBe(1); // Friday
  });

  it("returns 0 for a single Saturday", () => {
    expect(countWorkingDays("2026-01-10", "2026-01-10")).toBe(0);
  });

  it("returns 0 for a weekend-only range", () => {
    expect(countWorkingDays("2026-01-10", "2026-01-11")).toBe(0);
  });

  it("skips the weekend between Friday and Monday (= 2)", () => {
    expect(countWorkingDays("2026-01-09", "2026-01-12")).toBe(2);
  });

  it("handles a year boundary", () => {
    // Dec 28 2026 (Mon) → Jan 3 2027 (Sun): Dec 28–31 = 4, Jan 1–3 = Fri,Sat,Sun = 1
    expect(countWorkingDays("2026-12-28", "2027-01-03")).toBe(5);
  });

  it("handles leap-year February", () => {
    // Feb 23 2028 (Wed) → Feb 28 2028 (Mon): Wed,Thu,Fri,Mon = 4
    expect(countWorkingDays("2028-02-23", "2028-02-28")).toBe(4);
  });
});
