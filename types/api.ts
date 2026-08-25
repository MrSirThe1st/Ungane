export type ApiResult<T> =
  { success: true; data: T } | { success: false; error: string };

export type BusinessRole = "business_owner" | "business_staff";

export type UserRole = BusinessRole | "platform_admin";

export type MessageDirection = "INBOUND" | "OUTBOUND";

export type MessageStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";
