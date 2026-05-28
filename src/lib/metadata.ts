import type { Metadata } from "next";

export const siteConfig = {
  name: "StreetWatch",
  url: "https://streetwatchid.vercel.app",
  description:
    "Platform monitoring jalan rusak yang menghubungkan warga, pemerintah, dan teknologi AI untuk  mempercepat penanganan kerusakan jalan di seluruh Indonesia.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "StreetWatch - AI Powered Pothole Monitoring System",
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StreetWatch Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
