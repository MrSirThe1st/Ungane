import { NextResponse } from "next/server";

import { getEnv } from "@/config/env";
import { requireAppAccess } from "@/lib/auth/actions";
import { requireCurrentBusiness } from "@/lib/business/current";
import { logError } from "@/lib/errors";
import { ingestInboundMessage } from "@/lib/whatsapp/inbound";
import { stubInboundSchema } from "@/lib/validations/whatsapp";

export const dynamic = "force-dynamic";

/**
 * Dev-only: simulate an inbound WhatsApp message while provider=stub.
 * Auth required — uses the current user's business by default.
 */
export async function POST(request: Request) {
  if (getEnv().WHATSAPP_PROVIDER !== "stub") {
    return NextResponse.json(
      { error: "Stub inbound only available when WHATSAPP_PROVIDER=stub" },
      { status: 403 },
    );
  }

  try {
    await requireAppAccess();
    const business = await requireCurrentBusiness();
    const json = await request.json();
    const input = stubInboundSchema.parse({
      ...json,
      businessId: json.businessId ?? business.id,
    });

    if (input.businessId !== business.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await ingestInboundMessage({
      businessId: input.businessId,
      fromPhone: input.fromPhone,
      text: input.text,
      contactName: input.contactName ?? null,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data: result.data });
  } catch (error) {
    logError(error, "dev.whatsappInbound");
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
