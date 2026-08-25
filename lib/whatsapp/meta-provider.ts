/**
 * Placeholder for Meta WhatsApp Cloud API.
 * Not wired yet — stub is default until credentials are set.
 */
import type { MessagingService } from "./types";

export const metaMessagingProvider: MessagingService = {
  async sendMessage() {
    return {
      success: false,
      error: "Meta WhatsApp provider is not implemented yet",
    };
  },
  async sendTemplate() {
    return {
      success: false,
      error: "Meta WhatsApp provider is not implemented yet",
    };
  },
  async sendInteractiveMessage() {
    return {
      success: false,
      error: "Meta WhatsApp provider is not implemented yet",
    };
  },
  async handleWebhook() {
    return {
      success: false,
      error: "Meta WhatsApp provider is not implemented yet",
    };
  },
};
