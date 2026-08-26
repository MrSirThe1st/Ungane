import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { CSSProperties } from "react";

import { appConfig } from "@/config/app";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s · ${appConfig.name}`,
  },
  description:
    "Plateforme CRM et automatisation WhatsApp pour les entreprises africaines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={appConfig.defaultLocale}
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <body
        className="bg-background text-foreground flex min-h-full flex-col font-sans"
        style={
          {
            "--font-sans-family":
              "var(--font-plus-jakarta), 'Plus Jakarta Sans', 'Segoe UI', sans-serif",
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
