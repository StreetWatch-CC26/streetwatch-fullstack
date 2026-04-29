"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";

// Define types for toast messages
type ToastMessage = {
  title: string;
  desc: string;
  type: string;
};

type ToastMessages = {
  success: Record<string, ToastMessage>;
  error: Record<string, ToastMessage>;
  info: Record<string, ToastMessage>;
};

// Definisikan semua kemungkinan pesan di sini
const TOAST_MESSAGES: ToastMessages = {
  // Kondisi Success (Parameter 'success')
  success: {
    welcome: {
      title: "Selamat Datang!",
      desc: "Senang melihat Anda kembali.",
      type: "success",
    },
    onboarding_complete: {
      title: "Selesai!",
      desc: "Akun Anda siap digunakan.",
      type: "success",
    },
    logout: {
      title: "Berhasil Keluar",
      desc: "Sampai jumpa lagi!",
      type: "success",
    },
    profile_updated: {
      title: "Profil Diperbarui",
      desc: "Data berhasil disimpan.",
      type: "success",
    },
  },
  // Kondisi Error (Parameter 'error')
  error: {
    unauthorized: {
      title: "Akses Ditolak!",
      desc: "Anda tidak memiliki izin akses.",
      type: "error",
    },
    session_expired: {
      title: "Sesi Habis",
      desc: "Silakan login kembali.",
      type: "error",
    },
    login_required: {
      title: "Login Diperlukan",
      desc: "Silakan login untuk melanjutkan.",
      type: "error",
    },
    forbidden: {
      title: "Terlarang",
      desc: "Tindakan ini tidak diizinkan.",
      type: "error",
    },
  },
  // Kondisi Info/Warning (Parameter 'info')
  info: {
    maintenance: {
      title: "Pemeliharaan",
      desc: "Beberapa fitur mungkin lambat.",
      type: "info",
    },
    update_available: {
      title: "Update Baru",
      desc: "Versi terbaru sudah tersedia.",
      type: "info",
    },
  },
};

export default function ToastListener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Ambil semua tipe parameter yang mungkin kita gunakan
    const types: (keyof ToastMessages)[] = ["success", "error", "info"];
    let triggered = false;

    types.forEach((type) => {
      const key = searchParams.get(type);

      // Jika ada param (misal: ?error=session_expired) dan terdaftar di TOAST_MESSAGES
      if (key && key in TOAST_MESSAGES[type]) {
        const config = TOAST_MESSAGES[type][key];

        // Eksekusi Toast berdasarkan tipe
        if (config.type === "success")
          toast.success(config.title, { description: config.desc });
        if (config.type === "error")
          toast.error(config.title, { description: config.desc });
        if (config.type === "info")
          toast.info(config.title, { description: config.desc });

        triggered = true;
      }
    });

    // Bersihkan URL jika ada toast yang baru saja muncul
    if (triggered) {
      const url = new URL(window.location.href);
      types.forEach((type) => url.searchParams.delete(type));
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams, pathname]);

  return null;
}
