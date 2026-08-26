import { describe, expect, it } from "vitest";

import {
  createCampaignFormSchema,
  createTemplateFormSchema,
  sendCampaignSchema,
} from "@/lib/validations/campaign";

describe("createCampaignFormSchema", () => {
  it("accepts a draft campaign", () => {
    const result = createCampaignFormSchema.parse({
      name: "Promo août",
      templateId: "11111111-1111-4111-8111-111111111111",
      audienceTags: ["VIP"],
      scheduledAt: "",
    });
    expect(result.name).toBe("Promo août");
    expect(result.scheduledAt).toBeNull();
  });

  it("rejects a short campaign name", () => {
    expect(() =>
      createCampaignFormSchema.parse({
        name: "A",
        templateId: "11111111-1111-4111-8111-111111111111",
      }),
    ).toThrow();
  });
});

describe("createTemplateFormSchema", () => {
  it("accepts a technical template name", () => {
    const result = createTemplateFormSchema.parse({
      name: "promo_retour",
      displayName: "Promo retour",
      body: "Bonjour {{1}}",
    });
    expect(result.category).toBe("MARKETING");
  });

  it("rejects uppercase technical names", () => {
    expect(() =>
      createTemplateFormSchema.parse({
        name: "Promo",
        displayName: "Promo",
        body: "Hello",
      }),
    ).toThrow();
  });
});

describe("sendCampaignSchema", () => {
  it("requires a campaign uuid", () => {
    expect(() => sendCampaignSchema.parse({ campaignId: "bad" })).toThrow();
  });
});
