export {
  createCustomerSchema,
  createCustomerFormSchema,
  updateCustomerSchema,
  updateCustomerFormSchema,
  SUGGESTED_CUSTOMER_TAGS,
  type CreateCustomerInput,
  type CreateCustomerFormInput,
  type UpdateCustomerInput,
  type UpdateCustomerFormInput,
} from "./customer";

export {
  createCampaignSchema,
  createCampaignFormSchema,
  createTemplateFormSchema,
  sendCampaignSchema,
  DEFAULT_MESSAGE_TEMPLATES,
  type CreateCampaignInput,
  type CreateCampaignFormInput,
  type CreateTemplateFormInput,
  type SendCampaignInput,
} from "./campaign";

export {
  signUpSchema,
  signInSchema,
  createBusinessSchema,
  type SignUpInput,
  type SignInInput,
  type CreateBusinessInput,
} from "./auth";

export {
  connectWhatsAppSchema,
  stubInboundSchema,
  replyMessageSchema,
  type ConnectWhatsAppInput,
  type StubInboundInput,
  type ReplyMessageInput,
} from "./whatsapp";

export {
  setFlowEnabledSchema,
  appointmentIdSchema,
  FLOW_TYPES,
  BOOKING_KEYWORDS,
  type SetFlowEnabledInput,
  type AppointmentIdInput,
  type FlowType,
} from "./flows";

/** Parse with Zod; throw SafeError-friendly messages at API boundaries. */
export function parseOrThrow<T>(
  schema: { parse: (input: unknown) => T },
  input: unknown,
): T {
  return schema.parse(input);
}
