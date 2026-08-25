import { getEnv } from "@/config/env";

import { metaMessagingProvider } from "./meta-provider";
import { stubMessagingService } from "./stub-provider";
import type { MessagingService } from "./types";

export type {
  MessagingService,
  SendInteractiveMessageInput,
  SendMessageInput,
  SendTemplateInput,
  WebhookPayload,
} from "./types";

export { ingestInboundMessage, sendOutboundMessage } from "./inbound";
export type { InboundMessageInput } from "./inbound";

/** Provider switch: stub (default) | meta (WhatsApp Cloud API). */
export function getMessagingService(): MessagingService {
  const { WHATSAPP_PROVIDER } = getEnv();
  if (WHATSAPP_PROVIDER === "meta") {
    return metaMessagingProvider;
  }
  return stubMessagingService;
}
