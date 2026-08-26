import { describe, expect, it } from "vitest";

import {
  connectWhatsAppSchema,
  replyMessageSchema,
} from "@/lib/validations/whatsapp";

describe("connectWhatsAppSchema", () => {
  it("accepts a phone number", () => {
    const result = connectWhatsAppSchema.parse({
      phoneNumber: "+243800000001",
    });
    expect(result.phoneNumber).toContain("243");
  });
});

describe("replyMessageSchema", () => {
  it("rejects empty replies", () => {
    expect(() =>
      replyMessageSchema.parse({
        conversationId: "11111111-1111-4111-8111-111111111111",
        text: "",
      }),
    ).toThrow();
  });
});
