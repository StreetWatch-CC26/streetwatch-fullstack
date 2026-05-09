"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AddReportBtn() {
  return (
    <>
      <Tooltip>
        <Link href="/dashboard/reports/new">
          <TooltipTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20 rounded-full">
              <Plus className="w-4 h-4" />
              <span className="hidden md:block "> Buat Laporan Baru </span>
            </Button>
          </TooltipTrigger>
        </Link>
        <TooltipContent side="right" align="center">
          Buat Laporan Baru
        </TooltipContent>
      </Tooltip>
    </>
  );
}
