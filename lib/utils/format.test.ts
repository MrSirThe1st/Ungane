import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime, formatTime } from "@/lib/utils/format";

describe("format helpers (fr-CD)", () => {
  it("formats a valid datetime", () => {
    const value = formatDateTime("2026-08-01T10:30:00.000Z");
    expect(value).not.toBe("—");
    expect(value.length).toBeGreaterThan(4);
  });

  it("formats date and time separately", () => {
    expect(formatDate("2026-08-01T10:30:00.000Z")).not.toBe("—");
    expect(formatTime("2026-08-01T10:30:00.000Z")).not.toBe("—");
  });

  it("returns em dash for empty values", () => {
    expect(formatDateTime(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
    expect(formatTime("")).toBe("—");
  });
});
