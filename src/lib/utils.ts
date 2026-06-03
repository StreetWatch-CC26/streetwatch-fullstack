import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import imageCompression from "browser-image-compression";
import { matchKabupaten, matchProvinsi } from "@/data/wilayahCoord";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Inject external CSS once
export function injectCSS(href: string, id: string) {
  if (document.getElementById(id)) return;
  const el = document.createElement("link");
  el.id = id;
  el.rel = "stylesheet";
  el.href = href;
  document.head.appendChild(el);
}

/**
 * Compress image file while maintaining quality for ML analysis
 * Uses browser-image-compression library
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Maximum file size in MB
    maxWidthOrHeight: 1920, // Maximum width or height
    useWebWorker: true, // Use web worker for better performance
    fileType: "image/jpeg", // Convert to JPEG for better compression
    initialQuality: 0.85, // High quality for ML analysis (0.85 = 85%)
    alwaysKeepResolution: false,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    // If compressed file is larger than original, return original
    if (compressedFile.size > file.size) {
      return file;
    }

    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Convert file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Helper: Konversi Base64 ke File ───────────────────────────────────────────
export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Get current user location using browser Geolocation API
 */
export async function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}

/**
 * Reverse geocoding - converts coordinates to address using OSM Nominatim
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{
  address: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
}> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "StreetWatch-App/1.0.0",
          "Accept-Language": "id-ID,id;q=0.9",
        },
      },
    );

    if (!res.ok) throw new Error("Gagal mengambil data dari Nominatim");

    const data = await res.json();
    const addr = data.address || {};

    // Raw dari Nominatim
    const rawKota =
      addr.city || addr.town || addr.municipality || addr.regency || "";
    const rawProvinsi = addr.state || addr.region || "";

    // ↓ Match ke canonical name dari wilayahCoord
    const canonicalKota = matchKabupaten(rawKota)?.nama ?? rawKota;
    const canonicalProvinsi = matchProvinsi(rawProvinsi)?.nama ?? rawProvinsi;

    return {
      address:
        addr.road ||
        addr.pedestrian ||
        addr.path ||
        addr.hamlet ||
        data.display_name?.split(",")[0] ||
        "",
      kelurahan:
        addr.village ||
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        "",
      kecamatan: addr.city_district || addr.district || addr.county || "",
      kota: canonicalKota, // "Kota Pekanbaru" bukan "Pekanbaru"
      provinsi: canonicalProvinsi,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return {
      address: "",
      kelurahan: "",
      kecamatan: "",
      kota: "",
      provinsi: "",
    };
  }
}

/**
 * Format coordinates to display string
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Calculate distance between two coordinates (in kilometers)
 * Using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Page title mapping berdasarkan route
export const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> =
  {
    "/dashboard/overview": {
      title: "Statistik",
      subtitle: "Ringkasan statistik kerusakan jalan",
    },
    "/dashboard/overview/activity": {
      title: "Aktifitas Terbaru",
      subtitle: "Ringkasan aktifitas terbaru",
    },

    "/dashboard/map": {
      title: "Peta Sebaran",
      subtitle: "Sebaran kerusakan jalan di peta",
    },

    "/dashboard/reports": {
      title: "Daftar Laporan",
      subtitle: "Semua daftar laporan kerusakan jalan",
    },
    "/dashboard/reports/new": {
      title: "Buat Laporan",
      subtitle: "Laporkan kerusakan jalan yang kamu temui",
    },
    "/dashboard/reports/:id": {
      title: "Detail Laporan",
      subtitle: "Detail informasi kerusakan jalan ",
    },

    "/dashboard/profile": { title: "Profil", subtitle: "Akun & pencapaian" },

    "/dashboard/playground": {
      title: "StreetWatch AI",
      subtitle: "Analisis gambar kerusakan jalan dengan AI",
    },
  };

// Fungsi untuk mendapatkan title dan subtitle berdasarkan pathname
export function getPageMeta(pathname: string) {
  // 1. Cek pencocokan persis (Exact match)
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // 2. Cek pencocokan dinamis (:id)
  for (const route in PAGE_TITLES) {
    if (route.includes(":id")) {
      // Buat regex dan tangkap isinya dengan tanda kurung ([^/]+)
      const regexPattern = new RegExp(
        "^" + route.replace(":id", "([^/]+)") + "$",
      );
      const match = pathname.match(regexPattern);

      if (match) {
        const id = match[1]; // match[1] berisi ID yang diambil dari URL
        const meta = PAGE_TITLES[route];

        return {
          ...meta,
          // Gabungkan teks statis dengan ID yang didapat
          // title: `Detail Laporan ${id.substring(0, 6)}`, // Dipotong agar tidak terlalu panjang di mobile
          title: `Detail Laporan dengan ID: [${id}]`,
        };
      }
    }
  }

  // 3. Fallback jika tidak ditemukan
  return { title: "Street Watch", subtitle: undefined };
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateLong(isoString: string): string {
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Utility untuk membersihkan teks dari spasi dan enter berlebih.
 * @param text string input dari user
 * @returns string yang sudah dibersihkan
 */
export function cleanExcessWhitespace(text: string): string {
  if (!text) return "";

  return (
    text
      // 1. Menghapus spasi kosong/tab yang tidak sengaja terketik sebelum user menekan enter
      .replace(/[ \t]+$/gm, "")
      // 2. Mencegah enter berulang: Mengubah 3 atau lebih enter berturut-turut menjadi maksimal 2 enter (1 baris kosong)
      .replace(/\n{3,}/g, "\n\n")
      // 3. Menghapus semua spasi dan enter yang berada di paling awal dan paling AKHIR teks
      .trim()
  );
}
