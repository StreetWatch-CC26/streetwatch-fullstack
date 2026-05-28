import type { Viewport } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProviderClient from "@/components/providers/SessionProviderClient";

import ToastListener from "@/components/shared/ToastListener";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";
import { metadata } from "@/lib/metadata";
import { jsonLd } from "@/lib/seo";

import { Geist, Geist_Mono, Inter, Roboto_Slab } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

// FONT SETUP
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-serif",
});
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// VIEWPORT
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// METADATA
export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        inter.variable,
        robotoSlab.variable,
        geistSans.variable,
        geistMono.variable,
      )}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body className="flex flex-col min-h-dvh" suppressHydrationWarning>
        <Suspense fallback={<></>}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProviderClient>
              <Toaster position="top-center" />
              <ToastListener />

              <main>
                <TooltipProvider>{children}</TooltipProvider>
              </main>
            </SessionProviderClient>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
