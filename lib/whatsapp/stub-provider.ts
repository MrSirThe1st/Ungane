import type { MessagingService } from "./types";

function stubId(prefix: string) {
  return `${prefix}_${Date.now()}`;
}

/** Local/dev provider — logs and returns success without calling WhatsApp. */
export const stubMessagingService: MessagingService = {
  async sendMessage(input) {
    console.info("[whatsapp:stub] sendMessage", input);
    return { success: true, data: { id: stubId("msg") } };
  },

  async sendTemplate(input) {
    console.info("[whatsapp:stub] sendTemplate", input);
    return { success: true, data: { id: stubId("tpl") } };
  },

  async sendInteractiveMessage(input) {
    console.info("[whatsapp:stub] sendInteractiveMessage", input);
    return { success: true, data: { id: stubId("int") } };
  },

  async handleWebhook(payload) {
    console.info("[whatsapp:stub] handleWebhook", payload);
    return { success: true, data: { accepted: true } };
  },
};
