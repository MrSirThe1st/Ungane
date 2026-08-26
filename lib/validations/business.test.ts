import { describe, expect, it } from "vitest";

import { updateBusinessFormSchema } from "@/lib/validations/business";

describe("updateBusinessFormSchema", () => {
  it("accepts a valid business profile", () => {
    const result = updateBusinessFormSchema.parse({
      name: "Spa Lumière",
      industry: "Beauté",
      city: "Kinshasa",
      phone: "+243800000001",
    });

    expect(result.name).toBe("Spa Lumière");
    expect(result.industry).toBe("Beauté");
  });

  it("normalizes empty optional fields to null", () => {
    const result = updateBusinessFormSchema.parse({
      name: "Spa Lumière",
      industry: "",
      city: "",
      phone: "",
    });

    expect(result.industry).toBeNull();
    expect(result.city).toBeNull();
    expect(result.phone).toBeNull();
  });

  it("rejects a short business name", () => {
    expect(() =>
      updateBusinessFormSchema.parse({
        name: "A",
      }),
    ).toThrow();
  });
});
