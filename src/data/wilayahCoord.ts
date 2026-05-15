/**
 * data/wilayah-coords.ts
 *
 * Koordinat centroid statis untuk semua 38 provinsi dan
 * ratusan kabupaten/kota di Indonesia.
 *
 * Dipakai untuk zoom-in map saat filter dipilih.
 * Tidak ada fetch — instant, zero CORS.
 *
 * Sumber: yusufsyaifudin/wilayah-indonesia (MIT)
 * ID mengikuti Kemendagri (2 digit provinsi, 4 digit kabupaten).
 */

export interface WilayahCoord {
  id: string;
  nama: string;
  lat: number;
  lng: number;
  zoom: number;
}

// ─── 38 Provinsi ─────────────────────────────────────────────────────────────

export const PROVINSI_COORDS: WilayahCoord[] = [
  { id: "11", nama: "Aceh", lat: 4.6951, lng: 96.7494, zoom: 8 },
  { id: "12", nama: "Sumatera Utara", lat: 2.1154, lng: 99.5451, zoom: 8 },
  { id: "13", nama: "Sumatera Barat", lat: 0.7399, lng: 100.8, zoom: 8 },
  { id: "14", nama: "Riau", lat: 0.2933, lng: 101.7068, zoom: 8 },
  { id: "15", nama: "Jambi", lat: -1.6101, lng: 103.6131, zoom: 8 },
  { id: "16", nama: "Sumatera Selatan", lat: -3.3194, lng: 103.9144, zoom: 8 },
  { id: "17", nama: "Bengkulu", lat: -3.5778, lng: 102.3464, zoom: 8 },
  { id: "18", nama: "Lampung", lat: -4.5586, lng: 105.4068, zoom: 8 },
  {
    id: "19",
    nama: "Kepulauan Bangka Belitung",
    lat: -2.741,
    lng: 106.4406,
    zoom: 8,
  },
  { id: "21", nama: "Kepulauan Riau", lat: 3.9456, lng: 108.1429, zoom: 7 },
  { id: "31", nama: "DKI Jakarta", lat: -6.2088, lng: 106.8456, zoom: 11 },
  { id: "32", nama: "Jawa Barat", lat: -6.9175, lng: 107.6191, zoom: 8 },
  { id: "33", nama: "Jawa Tengah", lat: -7.15, lng: 110.1403, zoom: 8 },
  { id: "34", nama: "DI Yogyakarta", lat: -7.8754, lng: 110.4262, zoom: 10 },
  { id: "35", nama: "Jawa Timur", lat: -7.5361, lng: 112.2384, zoom: 8 },
  { id: "36", nama: "Banten", lat: -6.4058, lng: 106.064, zoom: 9 },
  { id: "51", nama: "Bali", lat: -8.3405, lng: 115.092, zoom: 9 },
  {
    id: "52",
    nama: "Nusa Tenggara Barat",
    lat: -8.6529,
    lng: 117.3616,
    zoom: 8,
  },
  {
    id: "53",
    nama: "Nusa Tenggara Timur",
    lat: -8.6574,
    lng: 121.0794,
    zoom: 7,
  },
  { id: "61", nama: "Kalimantan Barat", lat: 0.134, lng: 111.087, zoom: 7 },
  { id: "62", nama: "Kalimantan Tengah", lat: -1.6815, lng: 113.3824, zoom: 7 },
  {
    id: "63",
    nama: "Kalimantan Selatan",
    lat: -3.0926,
    lng: 115.2838,
    zoom: 8,
  },
  { id: "64", nama: "Kalimantan Timur", lat: 0.5387, lng: 116.4194, zoom: 7 },
  { id: "65", nama: "Kalimantan Utara", lat: 3.0731, lng: 116.0413, zoom: 7 },
  { id: "71", nama: "Sulawesi Utara", lat: 0.6246, lng: 123.975, zoom: 8 },
  { id: "72", nama: "Sulawesi Tengah", lat: -1.43, lng: 121.4456, zoom: 7 },
  { id: "73", nama: "Sulawesi Selatan", lat: -3.6687, lng: 119.974, zoom: 8 },
  { id: "74", nama: "Sulawesi Tenggara", lat: -4.1449, lng: 122.1746, zoom: 8 },
  { id: "75", nama: "Gorontalo", lat: 0.5435, lng: 123.0568, zoom: 9 },
  { id: "76", nama: "Sulawesi Barat", lat: -2.8441, lng: 119.2321, zoom: 8 },
  { id: "81", nama: "Maluku", lat: -3.2385, lng: 130.1453, zoom: 7 },
  { id: "82", nama: "Maluku Utara", lat: 1.5709, lng: 127.8087, zoom: 7 },
  { id: "91", nama: "Papua Barat", lat: -1.3361, lng: 133.1747, zoom: 7 },
  { id: "92", nama: "Papua", lat: -4.2699, lng: 138.0804, zoom: 7 },
  { id: "93", nama: "Papua Selatan", lat: -6.9, lng: 139.6, zoom: 7 },
  { id: "94", nama: "Papua Tengah", lat: -3.8, lng: 136.0, zoom: 7 },
  { id: "95", nama: "Papua Pegunungan", lat: -4.5, lng: 139.5, zoom: 7 },
  { id: "96", nama: "Papua Barat Daya", lat: -1.5, lng: 131.5, zoom: 7 },
];

// ─── Kabupaten / Kota ─────────────────────────────────────────────────────────
// zoom 12 = kota, zoom 10 = kabupaten luas

export const KABUPATEN_COORDS: WilayahCoord[] = [
  // Aceh (11)
  { id: "1101", nama: "Kabupaten Simeulue", lat: 2.65, lng: 96.0833, zoom: 10 },
  {
    id: "1102",
    nama: "Kabupaten Aceh Singkil",
    lat: 2.45,
    lng: 97.8,
    zoom: 10,
  },
  { id: "1171", nama: "Kota Banda Aceh", lat: 5.5483, lng: 95.3238, zoom: 12 },
  { id: "1172", nama: "Kota Sabang", lat: 5.8932, lng: 95.319, zoom: 12 },
  { id: "1173", nama: "Kota Langsa", lat: 4.4683, lng: 97.9706, zoom: 12 },
  { id: "1174", nama: "Kota Lhokseumawe", lat: 5.1801, lng: 97.15, zoom: 12 },
  // Sumatera Utara (12)
  { id: "1271", nama: "Kota Sibolga", lat: 1.739, lng: 98.781, zoom: 12 },
  { id: "1272", nama: "Kota Tanjung Balai", lat: 2.9667, lng: 99.8, zoom: 12 },
  {
    id: "1273",
    nama: "Kota Pematang Siantar",
    lat: 2.9595,
    lng: 99.0687,
    zoom: 12,
  },
  {
    id: "1274",
    nama: "Kota Tebing Tinggi",
    lat: 3.3267,
    lng: 99.165,
    zoom: 12,
  },
  { id: "1275", nama: "Kota Medan", lat: 3.5952, lng: 98.6722, zoom: 12 },
  { id: "1276", nama: "Kota Binjai", lat: 3.6002, lng: 98.485, zoom: 12 },
  {
    id: "1277",
    nama: "Kota Padang Sidempuan",
    lat: 1.3816,
    lng: 99.2699,
    zoom: 12,
  },
  {
    id: "1278",
    nama: "Kota Gunungsitoli",
    lat: 1.2877,
    lng: 97.6133,
    zoom: 12,
  },
  // Sumatera Barat (13)
  { id: "1371", nama: "Kota Padang", lat: -0.9471, lng: 100.4172, zoom: 12 },
  { id: "1372", nama: "Kota Solok", lat: -0.7974, lng: 100.6554, zoom: 12 },
  {
    id: "1373",
    nama: "Kota Sawahlunto",
    lat: -0.6821,
    lng: 100.7777,
    zoom: 12,
  },
  {
    id: "1374",
    nama: "Kota Padang Panjang",
    lat: -0.4598,
    lng: 100.4082,
    zoom: 12,
  },
  {
    id: "1375",
    nama: "Kota Bukittinggi",
    lat: -0.3062,
    lng: 100.3699,
    zoom: 12,
  },
  {
    id: "1376",
    nama: "Kota Payakumbuh",
    lat: -0.2261,
    lng: 100.6296,
    zoom: 12,
  },
  { id: "1377", nama: "Kota Pariaman", lat: -0.6233, lng: 100.1168, zoom: 12 },
  // Riau (14)
  {
    id: "1401",
    nama: "Kabupaten Kuantan Singingi",
    lat: -0.4009,
    lng: 101.55,
    zoom: 10,
  },
  {
    id: "1402",
    nama: "Kabupaten Indragiri Hulu",
    lat: -0.3784,
    lng: 102.4754,
    zoom: 10,
  },
  {
    id: "1403",
    nama: "Kabupaten Indragiri Hilir",
    lat: -0.5087,
    lng: 103.437,
    zoom: 10,
  },
  { id: "1404", nama: "Kabupaten Pelalawan", lat: 0.12, lng: 102.11, zoom: 10 },
  { id: "1405", nama: "Kabupaten Siak", lat: 1.25, lng: 102.0, zoom: 10 },
  {
    id: "1406",
    nama: "Kabupaten Kampar",
    lat: 0.3592,
    lng: 101.0283,
    zoom: 10,
  },
  {
    id: "1407",
    nama: "Kabupaten Rokan Hulu",
    lat: 0.9145,
    lng: 100.53,
    zoom: 10,
  },
  {
    id: "1408",
    nama: "Kabupaten Bengkalis",
    lat: 1.4808,
    lng: 102.11,
    zoom: 10,
  },
  {
    id: "1409",
    nama: "Kabupaten Rokan Hilir",
    lat: 2.206,
    lng: 100.886,
    zoom: 10,
  },
  {
    id: "1410",
    nama: "Kabupaten Kepulauan Meranti",
    lat: 1.04,
    lng: 102.6,
    zoom: 10,
  },
  { id: "1471", nama: "Kota Pekanbaru", lat: 0.5071, lng: 101.4478, zoom: 12 },
  { id: "1472", nama: "Kota Dumai", lat: 1.6833, lng: 101.45, zoom: 12 },
  // Kepulauan Riau (21)
  { id: "2101", nama: "Kabupaten Karimun", lat: 1.0, lng: 103.45, zoom: 10 },
  { id: "2102", nama: "Kabupaten Bintan", lat: 1.15, lng: 104.45, zoom: 10 },
  { id: "2103", nama: "Kabupaten Natuna", lat: 3.85, lng: 108.3, zoom: 10 },
  { id: "2104", nama: "Kabupaten Lingga", lat: 0.0, lng: 104.6, zoom: 10 },
  { id: "2171", nama: "Kota Batam", lat: 1.1301, lng: 104.053, zoom: 12 },
  {
    id: "2172",
    nama: "Kota Tanjungpinang",
    lat: 0.9167,
    lng: 104.45,
    zoom: 12,
  },
  // DKI Jakarta (31)
  {
    id: "3171",
    nama: "Kota Jakarta Selatan",
    lat: -6.2615,
    lng: 106.8106,
    zoom: 13,
  },
  {
    id: "3172",
    nama: "Kota Jakarta Timur",
    lat: -6.225,
    lng: 106.9004,
    zoom: 13,
  },
  {
    id: "3173",
    nama: "Kota Jakarta Pusat",
    lat: -6.1744,
    lng: 106.8227,
    zoom: 13,
  },
  {
    id: "3174",
    nama: "Kota Jakarta Barat",
    lat: -6.1675,
    lng: 106.7644,
    zoom: 13,
  },
  {
    id: "3175",
    nama: "Kota Jakarta Utara",
    lat: -6.1213,
    lng: 106.9005,
    zoom: 13,
  },
  {
    id: "3101",
    nama: "Kabupaten Kepulauan Seribu",
    lat: -5.605,
    lng: 106.57,
    zoom: 11,
  },
  // Jawa Barat (32)
  { id: "3201", nama: "Kabupaten Bogor", lat: -6.5971, lng: 106.806, zoom: 10 },
  {
    id: "3202",
    nama: "Kabupaten Sukabumi",
    lat: -7.0833,
    lng: 106.7167,
    zoom: 10,
  },
  {
    id: "3203",
    nama: "Kabupaten Cianjur",
    lat: -6.8222,
    lng: 107.1439,
    zoom: 10,
  },
  {
    id: "3204",
    nama: "Kabupaten Bandung",
    lat: -7.05,
    lng: 107.5667,
    zoom: 10,
  },
  { id: "3271", nama: "Kota Bogor", lat: -6.5971, lng: 106.806, zoom: 12 },
  { id: "3273", nama: "Kota Bandung", lat: -6.9175, lng: 107.6191, zoom: 12 },
  { id: "3274", nama: "Kota Cirebon", lat: -6.732, lng: 108.5523, zoom: 12 },
  { id: "3275", nama: "Kota Bekasi", lat: -6.2349, lng: 106.9896, zoom: 12 },
  { id: "3276", nama: "Kota Depok", lat: -6.4025, lng: 106.7942, zoom: 12 },
  { id: "3277", nama: "Kota Cimahi", lat: -6.8722, lng: 107.5422, zoom: 12 },
  {
    id: "3278",
    nama: "Kota Tasikmalaya",
    lat: -7.3274,
    lng: 108.2207,
    zoom: 12,
  },
  { id: "3279", nama: "Kota Banjar", lat: -7.3667, lng: 108.5333, zoom: 12 },
  // Jawa Tengah (33)
  {
    id: "3301",
    nama: "Kabupaten Cilacap",
    lat: -7.7297,
    lng: 108.837,
    zoom: 10,
  },
  { id: "3302", nama: "Kabupaten Banyumas", lat: -7.48, lng: 109.2, zoom: 10 },
  { id: "3371", nama: "Kota Magelang", lat: -7.4704, lng: 110.2179, zoom: 12 },
  { id: "3372", nama: "Kota Surakarta", lat: -7.5561, lng: 110.8317, zoom: 12 },
  { id: "3373", nama: "Kota Salatiga", lat: -7.3305, lng: 110.5084, zoom: 12 },
  { id: "3374", nama: "Kota Semarang", lat: -6.9932, lng: 110.4203, zoom: 12 },
  {
    id: "3375",
    nama: "Kota Pekalongan",
    lat: -6.8886,
    lng: 109.6753,
    zoom: 12,
  },
  { id: "3376", nama: "Kota Tegal", lat: -6.8797, lng: 109.1256, zoom: 12 },
  // DI Yogyakarta (34)
  {
    id: "3401",
    nama: "Kabupaten Kulon Progo",
    lat: -7.8203,
    lng: 110.1617,
    zoom: 11,
  },
  {
    id: "3402",
    nama: "Kabupaten Bantul",
    lat: -7.8886,
    lng: 110.3303,
    zoom: 11,
  },
  {
    id: "3403",
    nama: "Kabupaten Gunungkidul",
    lat: -7.9608,
    lng: 110.5922,
    zoom: 11,
  },
  {
    id: "3404",
    nama: "Kabupaten Sleman",
    lat: -7.7167,
    lng: 110.3568,
    zoom: 11,
  },
  {
    id: "3471",
    nama: "Kota Yogyakarta",
    lat: -7.8012,
    lng: 110.3645,
    zoom: 13,
  },
  // Jawa Timur (35)
  {
    id: "3501",
    nama: "Kabupaten Pacitan",
    lat: -8.1845,
    lng: 111.0754,
    zoom: 10,
  },
  {
    id: "3502",
    nama: "Kabupaten Ponorogo",
    lat: -7.8637,
    lng: 111.5,
    zoom: 10,
  },
  {
    id: "3503",
    nama: "Kabupaten Trenggalek",
    lat: -8.049,
    lng: 111.71,
    zoom: 10,
  },
  { id: "3571", nama: "Kota Kediri", lat: -7.8166, lng: 112.0114, zoom: 12 },
  { id: "3572", nama: "Kota Blitar", lat: -8.0957, lng: 112.1609, zoom: 12 },
  { id: "3573", nama: "Kota Malang", lat: -7.9797, lng: 112.6304, zoom: 12 },
  {
    id: "3574",
    nama: "Kota Probolinggo",
    lat: -7.7556,
    lng: 113.2159,
    zoom: 12,
  },
  { id: "3575", nama: "Kota Pasuruan", lat: -7.6471, lng: 112.9107, zoom: 12 },
  { id: "3576", nama: "Kota Mojokerto", lat: -7.4722, lng: 112.4338, zoom: 12 },
  { id: "3577", nama: "Kota Madiun", lat: -7.6298, lng: 111.5239, zoom: 12 },
  { id: "3578", nama: "Kota Surabaya", lat: -7.2575, lng: 112.7521, zoom: 12 },
  { id: "3579", nama: "Kota Batu", lat: -7.868, lng: 112.527, zoom: 12 },
  // Banten (36)
  {
    id: "3601",
    nama: "Kabupaten Pandeglang",
    lat: -6.3087,
    lng: 106.1059,
    zoom: 10,
  },
  {
    id: "3602",
    nama: "Kabupaten Lebak",
    lat: -6.5604,
    lng: 106.2567,
    zoom: 10,
  },
  { id: "3671", nama: "Kota Tangerang", lat: -6.1702, lng: 106.64, zoom: 12 },
  { id: "3672", nama: "Kota Cilegon", lat: -6.002, lng: 106.0, zoom: 12 },
  { id: "3673", nama: "Kota Serang", lat: -6.11, lng: 106.15, zoom: 12 },
  {
    id: "3674",
    nama: "Kota Tangerang Selatan",
    lat: -6.2887,
    lng: 106.7105,
    zoom: 12,
  },
  // Bali (51)
  {
    id: "5101",
    nama: "Kabupaten Jembrana",
    lat: -8.359,
    lng: 114.6229,
    zoom: 11,
  },
  {
    id: "5102",
    nama: "Kabupaten Tabanan",
    lat: -8.5456,
    lng: 115.1254,
    zoom: 11,
  },
  {
    id: "5103",
    nama: "Kabupaten Badung",
    lat: -8.6478,
    lng: 115.2191,
    zoom: 11,
  },
  { id: "5104", nama: "Kabupaten Gianyar", lat: -8.533, lng: 115.32, zoom: 11 },
  {
    id: "5105",
    nama: "Kabupaten Klungkung",
    lat: -8.5388,
    lng: 115.4021,
    zoom: 11,
  },
  {
    id: "5106",
    nama: "Kabupaten Bangli",
    lat: -8.4544,
    lng: 115.3581,
    zoom: 11,
  },
  {
    id: "5107",
    nama: "Kabupaten Karang Asem",
    lat: -8.4462,
    lng: 115.6097,
    zoom: 11,
  },
  {
    id: "5108",
    nama: "Kabupaten Buleleng",
    lat: -8.1122,
    lng: 115.0888,
    zoom: 11,
  },
  { id: "5171", nama: "Kota Denpasar", lat: -8.65, lng: 115.2167, zoom: 12 },
  // Sulawesi Selatan (73)
  {
    id: "7301",
    nama: "Kabupaten Kepulauan Selayar",
    lat: -6.1309,
    lng: 120.4456,
    zoom: 10,
  },
  {
    id: "7302",
    nama: "Kabupaten Bulukumba",
    lat: -5.5489,
    lng: 120.2269,
    zoom: 10,
  },
  {
    id: "7303",
    nama: "Kabupaten Bantaeng",
    lat: -5.5064,
    lng: 119.9614,
    zoom: 11,
  },
  { id: "7371", nama: "Kota Makassar", lat: -5.1477, lng: 119.4327, zoom: 12 },
  { id: "7372", nama: "Kota Pare-Pare", lat: -4.0135, lng: 119.6273, zoom: 12 },
  { id: "7373", nama: "Kota Palopo", lat: -2.9925, lng: 120.1969, zoom: 12 },
  // Kalimantan Selatan (63)
  {
    id: "6301",
    nama: "Kabupaten Tanah Laut",
    lat: -3.7206,
    lng: 114.7555,
    zoom: 10,
  },
  {
    id: "6371",
    nama: "Kota Banjarmasin",
    lat: -3.3194,
    lng: 114.5908,
    zoom: 12,
  },
  {
    id: "6372",
    nama: "Kota Banjarbaru",
    lat: -3.4419,
    lng: 114.8279,
    zoom: 12,
  },
  // Kalimantan Timur (64)
  {
    id: "6401",
    nama: "Kabupaten Paser",
    lat: -1.8316,
    lng: 116.2207,
    zoom: 10,
  },
  { id: "6471", nama: "Kota Samarinda", lat: -0.5022, lng: 117.1536, zoom: 12 },
  {
    id: "6472",
    nama: "Kota Balikpapan",
    lat: -1.2379,
    lng: 116.8529,
    zoom: 12,
  },
  { id: "6474", nama: "Kota Bontang", lat: 0.1333, lng: 117.5, zoom: 12 },
  // Sulawesi Utara (71)
  { id: "7171", nama: "Kota Manado", lat: 1.4748, lng: 124.8421, zoom: 12 },
  { id: "7172", nama: "Kota Bitung", lat: 1.4433, lng: 125.1975, zoom: 12 },
  { id: "7173", nama: "Kota Tomohon", lat: 1.3167, lng: 124.8333, zoom: 12 },
  { id: "7174", nama: "Kota Kotamobagu", lat: 0.7333, lng: 124.3167, zoom: 12 },
  // Papua (92)
  { id: "9471", nama: "Kota Jayapura", lat: -2.5337, lng: 140.7181, zoom: 12 },
  // Maluku (81)
  { id: "8171", nama: "Kota Ambon", lat: -3.6954, lng: 128.1814, zoom: 12 },
  // NTB (52)
  { id: "5271", nama: "Kota Mataram", lat: -8.5833, lng: 116.1167, zoom: 12 },
  { id: "5272", nama: "Kota Bima", lat: -8.4619, lng: 118.7261, zoom: 12 },
  // NTT (53)
  { id: "5371", nama: "Kota Kupang", lat: -10.1772, lng: 123.607, zoom: 12 },
];

// ─── Lookup Maps (built once at module load) ──────────────────────────────────

function norm(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

export const PROVINSI_BY_ID = new Map(PROVINSI_COORDS.map((p) => [p.id, p]));
export const PROVINSI_BY_NAMA = new Map(
  PROVINSI_COORDS.map((p) => [norm(p.nama), p]),
);
export const KABUPATEN_BY_ID = new Map(KABUPATEN_COORDS.map((k) => [k.id, k]));
export const KABUPATEN_BY_NAMA = new Map(
  KABUPATEN_COORDS.map((k) => [norm(k.nama), k]),
);

export function findProvinsi(query: string): WilayahCoord | undefined {
  return PROVINSI_BY_ID.get(query) ?? PROVINSI_BY_NAMA.get(norm(query));
}

export function findKabupaten(query: string): WilayahCoord | undefined {
  return KABUPATEN_BY_ID.get(query) ?? KABUPATEN_BY_NAMA.get(norm(query));
}
