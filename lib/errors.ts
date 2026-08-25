import { ZodError } from "zod";

import type { ApiResult } from "@/types/api";

const DEFAULT_SAFE_MESSAGE = "Une erreur est survenue. Réessayez.";

function serializeError(error: unknown): unknown {
  if (error instanceof ZodError) {
    return { type: "ZodError", issues: error.issues };
  }
  if (error instanceof Error) {
    return { type: error.name, message: error.message, stack: error.stack };
  }
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    return {
      message: record.message ?? "",
      code: record.code,
      details: record.details,
      hint: record.hint,
    };
  }
  return error;
}

/** Log the real error internally — never send this string to the UI. */
export function logError(error: unknown, context?: string): void {
  const payload = serializeError(error);
  if (context) {
    console.error(`[${context}]`, payload);
    return;
  }
  console.error(payload);
}

/**
 * Safe user-facing message. Prefer known `Error.message` only when it is
 * already a product-safe string you threw yourself — never raw DB/provider text.
 */
export function toSafeErrorMessage(
  error: unknown,
  fallback: string = DEFAULT_SAFE_MESSAGE,
): string {
  if (error instanceof SafeError) {
    return error.message;
  }
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallback;
  }
  return fallback;
}

/** Explicitly safe error for UI / ApiResult (message is OK to show). */
export class SafeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SafeError";
  }
}

export function failureResult(
  error: unknown,
  options?: { context?: string; fallback?: string },
): ApiResult<never> {
  logError(error, options?.context);
  return {
    success: false,
    error: toSafeErrorMessage(error, options?.fallback),
  };
}

export async function withSafeResult<T>(
  fn: () => Promise<T>,
  options?: { context?: string; fallback?: string },
): Promise<ApiResult<T>> {
  try {
    return { success: true, data: await fn() };
  } catch (error) {
    // Next.js redirect()/notFound() must not be swallowed as ApiResult failures.
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      ((error as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
        (error as { digest: string }).digest.startsWith("NEXT_HTTP_ERROR_FALLBACK") ||
        (error as { digest: string }).digest.startsWith("NEXT_NOT_FOUND"))
    ) {
      throw error;
    }
    return failureResult(error, options);
  }
}
