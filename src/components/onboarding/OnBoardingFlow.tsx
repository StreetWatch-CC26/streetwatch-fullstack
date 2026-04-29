"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StepContent from "./StepContent";
import StepNavigator from "./StepNavigator";

import { ONBOARDING_STEPS } from "./onboarding-data";

export default function OnboardingFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    document.cookie = "has-completed-onboarding=true; path=/; max-age=31536000";
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const currentStep = ONBOARDING_STEPS[currentIndex];

  return (
    <div className="h-dvh w-full bg-background flex flex-col items-center justify-center sm:p-6 md:p-8">
      <div className="w-full h-full sm:h-auto max-w-5xl bg-secondary sm:rounded-2xl shadow-sm sm:border border-accent flex flex-col p-5 md:p-10 relative overflow-hidden transition-all duration-500">
        {/* Header Kustom */}
        <div className="flex justify-between items-center w-full mb-4 md:mb-8 shrink-0">
          <Image
            src="/logo-light.png"
            alt="Logo"
            width={120}
            height={40}
            className="block"
          />

          {currentIndex !== ONBOARDING_STEPS.length - 1 && (
            <button
              onClick={handleFinish}
              className="text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
            >
              Lewati
            </button>
          )}
        </div>

        <div
          key={currentIndex}
          className="flex-1 flex flex-col justify-center min-h-0 animate-in fade-in slide-in-from-right-4 duration-500 ease-in-out"
        >
          <StepContent step={currentStep} />
        </div>

        {/* Navigasi Bawah */}
        <div className="shrink-0 mt-4 md:mt-8">
          <StepNavigator
            currentStepIndex={currentIndex}
            totalSteps={ONBOARDING_STEPS.length}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinish}
            onLogin={handleLogin}
          />
        </div>
      </div>
    </div>
  );
}
