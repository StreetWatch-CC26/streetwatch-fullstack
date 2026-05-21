import {
  type RemixiconComponentType,
  RiFlashlightFill,
  RiRoadMapFill,
  RiSearchAi2Fill,
  RiThumbUpFill,
} from "@remixicon/react";

export type OnboardingStep = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  visual: "report" | "ai" | "impact";
  listItems?: { icon: RemixiconComponentType; text: string }[];
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    visual: "report",
    title: "Foto, Lokasi, Kirim.",
    subtitle: "Semudah itu.",
    description:
      "Temukan jalan rusak di sekitarmu? Ambil foto, izinkan GPS mendeteksi lokasi secara otomatis, lalu kirim laporan dalam hitungan detik. Tanpa formulir panjang, tanpa ribet.",
  },
  {
    id: 2,
    visual: "ai",
    title: "AI Menganalisis Kerusakan",
    subtitle: "Otomatis & akurat.",
    description:
      "Setiap foto yang dikirim langsung dianalisis oleh model AI kami. Tingkat keparahan kerusakan terdeteksi secara otomatis — dari yang ringan hingga yang harus segera ditangani.",
    listItems: [
      {
        icon: RiSearchAi2Fill,
        text: "Deteksi lubang, retak, dan amblas secara otomatis",
      },
      {
        icon: RiFlashlightFill,
        text: "Prioritas tinggi langsung teridentifikasi",
      },
    ],
  },
  {
    id: 3,
    visual: "impact",
    title: "Bersama Kita Perbaiki Kota",
    subtitle: "Laporan nyata, dampak nyata.",
    description:
      "Setiap laporan masuk ke peta publik yang bisa dipantau warga dan pemerintah. Dukung laporan orang lain, pantau progres perbaikan, dan jadilah bagian dari perubahan.",
    listItems: [
      { icon: RiRoadMapFill, text: "Peta sebaran kerusakan seluruh Indonesia" },
      {
        icon: RiThumbUpFill,
        text: "Dukung laporan warga lain untuk percepat penanganan",
      },
    ],
  },
];
