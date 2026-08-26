import { describe, expect, it } from "vitest";

import { inviteStaffSchema } from "@/lib/validations/staff";

describe("inviteStaffSchema", () => {
  it("accepts a valid email", () => {
    const result = inviteStaffSchema.parse({
      email: "staff@example.com",
    });
    expect(result.email).toBe("staff@example.com");
  });

  it("rejects an invalid email", () => {
    expect(() =>
      inviteStaffSchema.parse({
        email: "not-an-email",
      }),
    ).toThrow();
  });
});
