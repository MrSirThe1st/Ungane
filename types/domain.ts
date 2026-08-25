import type { BusinessRole } from "@/types/api";

export type Business = {
  id: string;
  name: string;
  industry: string | null;
  country: string;
  city: string | null;
  phone: string | null;
  createdAt: string;
};

export type AppUser = {
  id: string;
  phone: string | null;
  email: string | null;
  name: string | null;
};

export type BusinessMembership = {
  id: string;
  userId: string;
  businessId: string;
  role: BusinessRole;
  status: "invited" | "active" | "inactive";
};

export type Customer = {
  id: string;
  businessId: string;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  tags: string[];
  lastInteractionAt: string | null;
  createdAt: string;
};

export type Conversation = {
  id: string;
  businessId: string;
  customerId: string;
  status: "open" | "closed";
  startedAt: string;
  lastMessageAt: string | null;
};

export type Message = {
  id: string;
  conversationId: string;
  direction: "INBOUND" | "OUTBOUND";
  type: string;
  content: string;
  whatsappMessageId: string | null;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  createdAt: string;
};
