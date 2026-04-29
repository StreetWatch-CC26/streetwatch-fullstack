import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";
import { AboutHero } from "@/components/about/AboutHero";
import { MissionSection } from "@/components/about/MissionSection";
import { TeamSection } from "@/components/about/TeamSection";
import { ValuesSection } from "@/components/about/ValuesSection";
import { PressSection } from "@/components/about/PressSection";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali tim dan misi di balik StreetWatch — platform monitoring jalan rusak berbasis AI untuk Indonesia.",
  openGraph: {
    title: `Tentang Kami | ${siteConfig.name}`,
    description:
      "Kenali tim dan misi di balik StreetWatch — platform monitoring jalan rusak berbasis AI untuk Indonesia.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <main>
        <AboutHero />
        <MissionSection />
        <ValuesSection />
        <TeamSection />
        <PressSection />
      </main>
    </>
  );
}
