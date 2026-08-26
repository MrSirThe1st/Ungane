"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { appConfig } from "@/config/app";

type BrandContextValue = {
  appName: string;
  businessName: string | null;
  businessId: string | null;
};

const BrandContext = createContext<BrandContextValue>({
  appName: appConfig.name,
  businessName: null,
  businessId: null,
});

export function BrandProvider({
  businessName,
  businessId,
  children,
}: {
  businessName?: string | null;
  businessId?: string | null;
  children: ReactNode;
}) {
  return (
    <BrandContext.Provider
      value={{
        appName: appConfig.name,
        businessName: businessName ?? null,
        businessId: businessId ?? null,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
