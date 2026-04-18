import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { cn } from "@/lib/utils";

const robotoSlab = Roboto_Slab({subsets:['latin'],variable:'--font-serif'});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Konfigurasi Viewport untuk mendukung responsivitas & tema warna browser
export const viewport: Viewport = {
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "#0d3242" },
  //   { media: "(prefers-color-scheme: dark)", color: "#d4fafe" },
  // ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://streetwatch.vercel.app"), // Ganti dengan domain asli nanti
  title: {
    default: "StreetWatch - AI Powered Pothole Monitoring & Reporting",
    template: "%s | StreetWatch",
  },
  description:
    "StreetWatch adalah platform monitoring jalan rusak berbasis AI. Laporkan lubang jalan secara real-time untuk membantu pemerintah mempercepat perbaikan infrastruktur di seluruh Indonesia.",
  keywords: [
    "lapor jalan rusak",
    "pothole monitoring AI",
    "pantau infrastruktur jalan",
    "StreetWatch Indonesia",
    "deteksi lubang jalan AI",
    "pelaporan masyarakat digital",
  ],
  authors: [
    { name: "Ali Musthafa Kamal", url: "https://github.com/your-profile" },
    { name: "Rangga ", url: "https://github.com/your-profile" },
    { name: "Firza", url: "https://github.com/your-profile" },
    { name: "Della", url: "https://github.com/your-profile" },
    { name: "Dzakiya", url: "https://github.com/your-profile" },
    { name: "Alif", url: "https://github.com/your-profile" },
  ],
  creator: "StreetWatch Team",
  publisher: "StreetWatch Project",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },

  // OpenGraph untuk Facebook/WhatsApp/Discord
  openGraph: {
    title: "StreetWatch - Pantau & Lapor Jalan Rusak Berbasis AI",
    description:
      "Membantu mobilitas masyarakat melalui sistem klasifikasi kerusakan jalan otomatis.",
    url: "https://streetwatch.vercel.app",
    siteName: "StreetWatch",
    images: [
      {
        url: "/og-image.png", // Letakkan gambar preview di folder /public
        width: 1200,
        height: 630,
        alt: "StreetWatch Dashboard Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "StreetWatch - AI Powered Pothole Monitoring",
    description:
      "Platform cerdas untuk pelaporan infrastruktur jalan yang lebih transparan.",
    images: ["/og-image.png"],
    creator: "@streetwatch_id",
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon-192x192.png",
    apple: "/apple-touch-icon.png",
  },

  // Verification (Google Search Console)
  verification: {
    google: "kode-verifikasi-google-anda", // Masukkan kode dari GSC
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 3. Structured Data (JSON-LD) untuk memperkuat SEO Organik
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "StreetWatch",
    description: "AI-Powered Pothole Monitoring & Reporting Platform",
    url: "https://streetwatch.vercel.app",
    applicationCategory: "Infrastructure Tool",
    operatingSystem: "Web",
    author: {
      "@type": "Organization",
      name: "StreetWatch Team",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
  };
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
              "h-full",
              "antialiased",
              geistSans.variable,
              geistMono.variable,
              inter.variable,
            , "font-serif", robotoSlab.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
