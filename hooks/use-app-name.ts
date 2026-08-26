"use client";

import { useBrand } from "@/components/providers/brand-provider";
import { appConfig } from "@/config/app";

/**
 * Display name for chrome: active business when available, else product name.
 */
export function useAppName() {
  const { appName, businessName } = useBrand();
  return businessName?.trim() || appName || appConfig.name;
}

/** Always the product brand (UNGANE), never the business name. */
export function useProductName() {
  const { appName } = useBrand();
  return appName || appConfig.name;
}
