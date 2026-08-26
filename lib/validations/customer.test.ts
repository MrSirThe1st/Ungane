import { describe, expect, it } from "vitest";

import { createCustomerFormSchema } from "@/lib/validations/customer";

describe("createCustomerFormSchema", () => {
  it("accepts a minimal valid customer", () => {
    const result = createCustomerFormSchema.parse({
      phoneNumber: "+243800000001",
      firstName: "Marie",
      lastName: "Kabila",
      email: "",
      tags: ["VIP"],
    });

    expect(result.phoneNumber).toBe("+243800000001");
    expect(result.tags).toEqual(["VIP"]);
    expect(result.email).toBeNull();
  });

  it("rejects an invalid phone number", () => {
    expect(() =>
      createCustomerFormSchema.parse({
        phoneNumber: "abc",
      }),
    ).toThrow();
  });
});
