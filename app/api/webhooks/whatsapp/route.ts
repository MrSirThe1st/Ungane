import { NextResponse } from "next/server";

import { getEnv } from "@/config/env";
import { logError } from "@/lib/errors";
import { ingestInboundMessage } from "@/lib/whatsapp/inbound";

export const dynamic = "force-dynamic";

/**
 * Meta webhook verification (GET) + receive (POST).
 * Stub mode accepts simplified JSON payloads for local testing.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = getEnv().WHATSAPP_WEBHOOK_SECRET;

  if (mode === "subscribe" && verifyToken && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;
    const env = getEnv();

    // Stub / local simulator shape
    if (
      payload &&
      typeof payload === "object" &&
      "businessId" in payload &&
      "fromPhone" in payload &&
      "text" in payload
    ) {
      const body = payload as {
        businessId: string;
        fromPhone: string;
        text: string;
        contactName?: string;
      };

      const result = await ingestInboundMessage({
        businessId: body.businessId,
        fromPhone: body.fromPhone,
        text: body.text,
        contactName: body.contactName ?? null,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ ok: true, data: result.data });
    }

    // Meta Cloud API payload (parse when provider=meta is fully wired)
    if (env.WHATSAPP_PROVIDER === "meta") {
      logError(payload, "whatsapp.webhook.meta.unparsed");
      return NextResponse.json({
        ok: true,
        note: "Meta payload received; parser not implemented yet",
      });
    }

    return NextResponse.json({ error: "Unsupported payload" }, { status: 400 });
  } catch (error) {
    logError(error, "whatsapp.webhook");
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
