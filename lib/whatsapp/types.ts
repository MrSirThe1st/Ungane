import type { ApiResult } from "@/types/api";

export type SendMessageInput = {
  to: string;
  body: string;
  businessId: string;
};

export type SendTemplateInput = {
  to: string;
  templateName: string;
  language: string;
  businessId: string;
  variables?: Record<string, string>;
};

export type SendInteractiveMessageInput = {
  to: string;
  businessId: string;
  body: string;
  buttons: Array<{ id: string; title: string }>;
};

export type WebhookPayload = {
  raw: unknown;
};

export type MessagingService = {
  sendMessage: (input: SendMessageInput) => Promise<ApiResult<{ id: string }>>;
  sendTemplate: (
    input: SendTemplateInput,
  ) => Promise<ApiResult<{ id: string }>>;
  sendInteractiveMessage: (
    input: SendInteractiveMessageInput,
  ) => Promise<ApiResult<{ id: string }>>;
  handleWebhook: (
    payload: WebhookPayload,
  ) => Promise<ApiResult<{ accepted: boolean }>>;
};
