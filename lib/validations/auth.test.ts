import { describe, expect, it } from "vitest";

import { signInSchema, signUpSchema } from "@/lib/validations/auth";

describe("signUpSchema", () => {
  it("accepts a valid signup payload", () => {
    const result = signUpSchema.parse({
      name: "Marie Kabila",
      email: "marie@spa.cd",
      password: "secret123",
    });
    expect(result.email).toBe("marie@spa.cd");
  });

  it("rejects a short password", () => {
    expect(() =>
      signUpSchema.parse({
        name: "Marie",
        email: "marie@spa.cd",
        password: "short",
      }),
    ).toThrow();
  });
});

describe("signInSchema", () => {
  it("requires email and password", () => {
    const result = signInSchema.parse({
      email: "owner@spa.cd",
      password: "secret123",
    });
    expect(result.email).toBe("owner@spa.cd");
  });

  it("rejects an invalid email", () => {
    expect(() =>
      signInSchema.parse({
        email: "not-an-email",
        password: "secret123",
      }),
    ).toThrow();
  });
});
