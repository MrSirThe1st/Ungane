"use client";

import { useSyncExternalStore } from "react";

import { appConfig } from "@/config/app";

/** Placeholder hook — replace with real session store later. */
export function useAppName() {
  return useSyncExternalStore(
    () => () => undefined,
    () => appConfig.name,
    () => appConfig.name,
  );
}
