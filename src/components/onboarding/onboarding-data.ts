export type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  statusText?: string;
  imageSrc?: string;
  listItems?: string[];
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Kalibrasi Grid Sensor Aktif.",
    description:
      "Membangun koneksi aman ke node infrastruktur lokal. Sistem StreetWatch menyelaraskan grid Lidar berfrekuensi tinggi untuk memastikan akurasi spasial absolut sebelum penerapan.",
    statusText:
      "TARGET LATENSI < 12ms | STATUS SINKRONISASI NODE Menunggu Uplink",
    imageSrc: "/images/onboarding/png_favicon.png",
  },
  {
    id: 2,
    title: "Jaringan Mesh Terdesentralisasi",
    description:
      "Node StreetWatch secara otomatis membentuk jaringan mesh yang dapat memulihkan diri (self-healing). Setiap perangkat memperluas area jangkauan, memastikan aliran data berlanjut bahkan di area tanpa sinyal.",
    imageSrc: "/images/onboarding/png_favicon.png",
  },
  {
    id: 3,
    title: "Analisis dan Optimasi",
    description:
      "Manfaatkan aliran data beresolusi tinggi. Instrumen presisi kami mengubah metrik mentah menjadi wawasan yang dapat ditindaklanjuti, memastikan operasi Anda terkalibrasi untuk performa maksimal.",
    imageSrc: "/images/onboarding/png_favicon.png",
  },
  {
    id: 4,
    title: "Siap untuk Diterapkan",
    description:
      "Ruang kerja Anda telah terkalibrasi. Akses kecerdasan spasial real-time, pantau anomali lokal, dan mulai petakan zona operasional Anda sekarang juga.",
    imageSrc: "/images/onboarding/png_favicon.png",
    listItems: [
      "Enkripsi End-to-End - Semua transmisi diamankan dengan protokol AES-256.",
      "Integrasi Jaringan Langsung - Terhubung ke grid sensor kota yang sudah ada.",
    ],
  },
];
