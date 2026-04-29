/**
 * geo-service.ts
 *
 * Dua sumber data digunakan secara komplementer:
 *
 * 1. ibnux API  (https://ibnux.github.io/data-indonesia/)
 *    → Dropdown filter Provinsi / Kab-Kota / Kecamatan / Kelurahan
 *    → Ringan, JSON per level, lazy-loaded
 *
 * 2. ardian28 GeoJSON  (raw.githubusercontent.com/ardian28/GeoJson-Indonesia-38-Provinsi)
 *    → Polygon batas wilayah di peta Leaflet
 *    → Fetch on-demand hanya level yang dipilih user
 *
 * Semua hasil di-cache in-memory agar tidak re-fetch.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WilayahItem {
  id: string;
  nama: string;
}

export interface WilayahGeoJSON {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: any;
  };
}

// ─── Base URLs ────────────────────────────────────────────────────────────────

const IBNUX_BASE = "https://ibnux.github.io/data-indonesia";

/**
 * ardian28 repo structure (assumed based on README):
 *   /provinsi/{nama-provinsi-slug}.geojson
 *   /kabupaten/{id-provinsi}/{nama-kab-slug}.geojson
 *   /kecamatan/{id-kabupaten}/{nama-kec-slug}.geojson
 *
 * We use jsDelivr CDN for better CORS + caching vs raw.githubusercontent.com
 */
const ARDIAN_BASE =
  "https://cdn.jsdelivr.net/gh/ardian28/GeoJson-Indonesia-38-Provinsi@main";

// ─── In-memory cache ──────────────────────────────────────────────────────────

const cache = new Map<string, any>();

async function cachedFetch<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
  const data = await res.json();
  cache.set(url, data);
  return data as T;
}

// ─── ibnux: Wilayah list APIs ─────────────────────────────────────────────────

/** Semua provinsi (38 provinsi) */
export async function fetchProvinsi(): Promise<WilayahItem[]> {
  return cachedFetch<WilayahItem[]>(`${IBNUX_BASE}/provinsi.json`);
}

/** Kabupaten/kota berdasarkan id provinsi */
export async function fetchKabupaten(
  idProvinsi: string,
): Promise<WilayahItem[]> {
  return cachedFetch<WilayahItem[]>(
    `${IBNUX_BASE}/kabupaten/${idProvinsi}.json`,
  );
}

/** Kecamatan berdasarkan id kabupaten */
export async function fetchKecamatan(
  idKabupaten: string,
): Promise<WilayahItem[]> {
  return cachedFetch<WilayahItem[]>(
    `${IBNUX_BASE}/kecamatan/${idKabupaten}.json`,
  );
}

/** Kelurahan berdasarkan id kecamatan */
export async function fetchKelurahan(
  idKecamatan: string,
): Promise<WilayahItem[]> {
  return cachedFetch<WilayahItem[]>(
    `${IBNUX_BASE}/kelurahan/${idKecamatan}.json`,
  );
}

// ─── ardian28: GeoJSON polygon APIs ──────────────────────────────────────────

/**
 * Slug helper — ardian28 kemungkinan pakai nama file lowercase + spasi → tanda-hubung
 * Contoh: "Jawa Barat" → "jawa-barat"
 */
function toSlug(nama: string): string {
  return nama
    .toLowerCase()
    .replace(/\//g, "-") // "Kab/Kota" → "kab-kota"
    .replace(/\s+/g, "-") // spasi → -
    .replace(/[^a-z0-9-]/g, ""); // buang karakter aneh
}

/**
 * Polygon batas provinsi.
 * URL: /provinsi/{slug}.geojson
 *
 * Jika fetch gagal (nama file berbeda di repo), kembalikan null
 * sehingga peta tetap bisa digunakan tanpa polygon.
 */
export async function fetchProvinsiGeoJSON(
  namaProvinsi: string,
): Promise<WilayahGeoJSON | null> {
  const slug = toSlug(namaProvinsi);
  const url = `${ARDIAN_BASE}/provinsi/${slug}.geojson`;
  try {
    return await cachedFetch<WilayahGeoJSON>(url);
  } catch {
    console.warn(`[GeoJSON] Provinsi tidak ditemukan: ${url}`);
    return null;
  }
}

/**
 * Polygon batas kabupaten/kota.
 * URL: /kabupaten/{id-provinsi}/{slug}.geojson
 */
export async function fetchKabupatenGeoJSON(
  idProvinsi: string,
  namaKabupaten: string,
): Promise<WilayahGeoJSON | null> {
  const slug = toSlug(namaKabupaten);
  const url = `${ARDIAN_BASE}/kabupaten/${idProvinsi}/${slug}.geojson`;
  try {
    return await cachedFetch<WilayahGeoJSON>(url);
  } catch {
    console.warn(`[GeoJSON] Kabupaten tidak ditemukan: ${url}`);
    return null;
  }
}

/**
 * Polygon batas kecamatan.
 * URL: /kecamatan/{id-kabupaten}/{slug}.geojson
 */
export async function fetchKecamatanGeoJSON(
  idKabupaten: string,
  namaKecamatan: string,
): Promise<WilayahGeoJSON | null> {
  const slug = toSlug(namaKecamatan);
  const url = `${ARDIAN_BASE}/kecamatan/${idKabupaten}/${slug}.geojson`;
  try {
    return await cachedFetch<WilayahGeoJSON>(url);
  } catch {
    console.warn(`[GeoJSON] Kecamatan tidak ditemukan: ${url}`);
    return null;
  }
}

// ─── Centroid helper ──────────────────────────────────────────────────────────

/**
 * Hitung centroid kasar dari GeoJSON FeatureCollection
 * (rata-rata koordinat semua vertex — cukup untuk flyTo)
 */
export function getCentroid(
  geojson: WilayahGeoJSON,
): { lat: number; lng: number } | null {
  const coords: [number, number][] = [];

  function collect(c: any) {
    if (typeof c[0] === "number") {
      coords.push(c as [number, number]);
    } else {
      c.forEach(collect);
    }
  }

  geojson.features.forEach((f) => collect(f.geometry.coordinates));
  if (coords.length === 0) return null;

  const avgLng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
  const avgLat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
  return { lat: avgLat, lng: avgLng };
}
