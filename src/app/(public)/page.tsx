import { CTASection } from "@/components/landing/CtaSection";
import { FAQSection } from "@/components/landing/FaqSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ImpactSection } from "@/components/landing/ImpactSection";

import { cookies } from "next/headers";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authjs.session-token")?.value;

  const isLoggedIn = !!token;
  return (
    <main className="flex flex-col items-center justify-center">
      <div className=" min-h-dvh w-full">
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        <HowItWorksSection />
        <ImpactSection />
        <FAQSection />
        <CTASection />
      </div>
    </main>
  );
}
