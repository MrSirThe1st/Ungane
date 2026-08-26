import { describe, expect, it } from "vitest";

import { matchesBookingKeyword } from "@/lib/validations/flows";

describe("matchesBookingKeyword", () => {
  it("matches common French booking keywords", () => {
    expect(matchesBookingKeyword("Bonjour, je voudrais un RDV")).toBe(true);
    expect(matchesBookingKeyword("Je veux réserver")).toBe(true);
    expect(matchesBookingKeyword("RENDEZ VOUS demain")).toBe(true);
  });

  it("ignores unrelated messages", () => {
    expect(matchesBookingKeyword("Bonjour")).toBe(false);
    expect(matchesBookingKeyword("Quels sont vos horaires ?")).toBe(false);
  });
});
