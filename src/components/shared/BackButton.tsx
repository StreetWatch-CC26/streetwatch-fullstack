"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      className="rounded-lg shadow-xl border border-border"
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-4 h-4" />
    </Button>
  );
}
