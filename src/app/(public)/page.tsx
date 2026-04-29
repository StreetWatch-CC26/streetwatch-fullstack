import { CTASection } from "@/components/landing/CtaSection";
import { FAQSection } from "@/components/landing/FaqSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection ";
import { ImpactSection } from "@/components/landing/ImpactSection";

export default async function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className=" min-h-dvh w-full">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ImpactSection />
        <FAQSection />
        <CTASection />
      </div>
    </main>
  );
}
