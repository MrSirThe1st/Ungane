import { describe, expect, it } from "vitest";

import { SafeError, toSafeErrorMessage } from "@/lib/errors";

describe("toSafeErrorMessage", () => {
  it("returns SafeError message", () => {
    expect(toSafeErrorMessage(new SafeError("Profil introuvable."))).toBe(
      "Profil introuvable.",
    );
  });

  it("returns fallback for unknown errors", () => {
    expect(toSafeErrorMessage(new Error("db connection failed"))).toBe(
      "Une erreur est survenue. Réessayez.",
    );
  });
});

describe("SafeError", () => {
  it("sets name to SafeError", () => {
    const error = new SafeError("Test");
    expect(error.name).toBe("SafeError");
    expect(error.message).toBe("Test");
  });
});
