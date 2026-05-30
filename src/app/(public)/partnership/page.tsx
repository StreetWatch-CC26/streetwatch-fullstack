import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";

import { PartnershipHero } from "@/components/partnership/PartnershipHero";
import { PartnershipTiers } from "@/components/partnership/PartnershipTiers";
import { BenefitsSection } from "@/components/partnership/BenefitsSection";
import { ProcessSection } from "@/components/partnership/ProcessSection";
import { CaseStudiesSection } from "@/components/partnership/CaseStudiesSection";
import { PartnershipForm } from "@/components/partnership/PartnershipForm";

export const metadata: Metadata = {
  title: "Kemitraan",
  description:
    "Bermitra dengan StreetWatch untuk mewujudkan infrastruktur jalan yang lebih baik melalui teknologi AI dan data terbuka.",
  openGraph: {
    title: `Kemitraan | ${siteConfig.name}`,
    description:
      "Bermitra dengan StreetWatch untuk mewujudkan infrastruktur jalan yang lebih baik melalui teknologi AI dan data terbuka.",
    url: `${siteConfig.url}/partnership`,
  },
};

export default function PartnershipPage() {
  return (
    <>
      <main>
        <PartnershipHero />
        <PartnershipTiers />
        <BenefitsSection />
        <ProcessSection />
        <CaseStudiesSection />
        <PartnershipForm />
      </main>
    </>
  );
}
