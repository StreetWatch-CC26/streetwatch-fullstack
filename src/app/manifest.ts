import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StreetWatch",
    short_name: "StreetWatch",
    description: "AI-powered pothole monitoring system",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d3242",

    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
