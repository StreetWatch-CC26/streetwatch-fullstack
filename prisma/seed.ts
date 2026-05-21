// prisma/seed.ts
import {
  Role,
  Urgency,
  ReportStatus,
  DamageCategory,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ─── HELPER GENERATOR ────────────────────────────────────────────────────────
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const getRandomFloat = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// Data referensi lokasi (Pekanbaru, Jakarta, Surabaya, dll)
const LOCATIONS = [
  {
    provinsi: "Riau",
    kota: "Pekanbaru",
    kecamatan: [
      "Tampan",
      "Marpoyan Damai",
      "Bukit Raya",
      "Payung Sekaki",
      "Sukajadi",
    ],
    kelurahan: [
      "Simpang Baru",
      "Sidomulyo",
      "Tangkerang",
      "Labuh Baru",
      "Jadirejo",
    ],
    jalan: [
      "Jl. HR Soebrantas",
      "Jl. Jend. Sudirman",
      "Jl. Arifin Ahmad",
      "Jl. Riau",
      "Jl. Gajah Mada",
    ],
    lat: [0.45, 0.55],
    lng: [101.4, 101.5],
  },
  {
    provinsi: "DKI Jakarta",
    kota: "Jakarta Selatan",
    kecamatan: ["Cilandak", "Kebayoran Baru", "Pasar Minggu", "Tebet"],
    kelurahan: ["Lebak Bulus", "Senayan", "Pejaten", "Tebet Timur"],
    jalan: [
      "Jl. Cilandak KKO",
      "Jl. Sudirman",
      "Jl. Casablanca",
      "Jl. Gatot Subroto",
    ],
    lat: [-6.3, -6.22],
    lng: [106.78, 106.85],
  },
  {
    provinsi: "Jawa Timur",
    kota: "Surabaya",
    kecamatan: ["Gayungan", "Bulak", "Wonokromo", "Gubeng"],
    kelurahan: ["Ketintang", "Kenjeran", "Ngagel", "Airlangga"],
    jalan: ["Jl. Ahmad Yani", "Jl. Raya Darmo", "Jl. Kenjeran", "Jl. Pemuda"],
    lat: [-7.35, -7.25],
    lng: [112.7, 112.8],
  },
  {
    provinsi: "Jawa Barat",
    kota: "Bandung",
    kecamatan: ["Coblong", "Lengkong", "Sumur Bandung", "Cicendo"],
    kelurahan: ["Dago", "Cijagra", "Braga", "Pasirkaliki"],
    jalan: [
      "Jl. Ir. H. Djuanda",
      "Jl. Buah Batu",
      "Jl. Asia Afrika",
      "Jl. Pasteur",
    ],
    lat: [-6.95, -6.85],
    lng: [107.55, 107.65],
  },
];

const ADJECTIVES = [
  "parah",
  "berbahaya",
  "cukup lebar",
  "dalam",
  "mengganggu lalu lintas",
  "membuat macet",
  "sering memakan korban",
];

async function main() {
  console.log("🌱 Mulai seeding database StreetWatch...\n");

  // ─── 1. BADGES ─────────────────────────────────────────────────────────────
  console.log("📛 Seeding badges...");
  const badgeData = [
    {
      key: "pelapor_pertama",
      name: "Pelapor Pertama",
      description: "Membuat laporan pertama",
      icon: "🌟",
      minReports: 1,
      minPoints: 0,
    },
    {
      key: "pelapor_aktif",
      name: "Pelapor Aktif",
      description: "Membuat 10+ laporan",
      icon: "🏆",
      minReports: 10,
      minPoints: 0,
    },
    {
      key: "warga_peduli",
      name: "Warga Peduli",
      description: "Mengumpulkan 250 poin",
      icon: "💪",
      minReports: 0,
      minPoints: 250,
    },
    {
      key: "penginspirasi",
      name: "Penginspirasi",
      description: "Mengumpulkan 500 poin",
      icon: "🔥",
      minReports: 0,
      minPoints: 500,
    },
    {
      key: "penjaga_kota",
      name: "Penjaga Kota",
      description: "Membuat 25+ laporan",
      icon: "🛡️",
      minReports: 25,
      minPoints: 0,
    },
    {
      key: "veteran_jalan",
      name: "Veteran Jalan",
      description: "Membuat 50+ laporan",
      icon: "🎖️",
      minReports: 50,
      minPoints: 0,
    },
    {
      key: "pahlawan_kota",
      name: "Pahlawan Kota",
      description: "Mengumpulkan 1000 poin",
      icon: "👑",
      minReports: 0,
      minPoints: 1000,
    },
  ];

  const badges: Record<string, { id: string }> = {};
  for (const badge of badgeData) {
    const b = await prisma.badge.upsert({
      where: { key: badge.key },
      update: badge,
      create: badge,
    });
    badges[badge.key] = b;
  }
  console.log(`   ✅ ${badgeData.length} badges seeded\n`);

  // ─── 2. USERS ──────────────────────────────────────────────────────────────
  console.log("👤 Seeding users...");
  const passwordHash = await bcrypt.hash("Password123", 12);
  const adminPasswordHash = await bcrypt.hash("Admin123!", 12);

  const usersData = [
    {
      name: "Admin StreetWatch",
      email: "admin@streetwatch.ai",
      password: adminPasswordHash,
      role: Role.ADMIN,
      points: 1500,
    },
    {
      name: "Ali Musthafa Kamal",
      email: "ali@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 620,
    },
    {
      name: "Firza Hakim",
      email: "firza@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 340,
    },
    {
      name: "Della Nurizki",
      email: "della@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 180,
    },
    {
      name: "Dzakiya Hakima Adila",
      email: "dzakiya@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 95,
    },
    {
      name: "Alif Budi Setiyawan",
      email: "alif@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 50,
    },
    {
      name: "Rangga Adi",
      email: "rangga@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 10,
    },
  ];

  const users: Record<string, { id: string }> = {};
  const userEmails: string[] = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, points: u.points },
      create: u,
    });
    users[u.email] = user;
    if (u.role === Role.CITIZEN) userEmails.push(u.email);
  }
  console.log(`   ✅ ${usersData.length} users seeded\n`);

  // ─── 3. REPORTS (100 DATA DUMMY) ───────────────────────────────────────────
  console.log("📋 Seeding 100 reports...");
  const TOTAL_REPORTS = 100;
  const now = new Date();

  const KATEGORI = Object.values(DamageCategory); // lubang, retak, dll
  const URGENCY = Object.values(Urgency); // low, medium, high

  const reportsToCreate = Array.from({ length: TOTAL_REPORTS }).map(() => {
    const loc = getRandomItem(LOCATIONS);
    const jalan = getRandomItem(loc.jalan);
    const category = getRandomItem(KATEGORI);
    const urgency = getRandomItem(URGENCY);

    // ─── Status & AI Logic ──────────────────────────────────────────
    // Status awal dari sistem hanya bisa verified (sukses) atau fail (gagal).
    const isFail = Math.random() > 0.8; // 20% kemungkinan AI menolak/gagal
    const status = isFail ? ReportStatus.fail : ReportStatus.verified;

    // Hitung probabilitas AI Score berdasarkan urgency jika tidak fail
    const baseScore = urgency === "high" ? 80 : urgency === "medium" ? 50 : 20;

    const aiScore = isFail
      ? null
      : baseScore + getRandomInt(0, 19) + getRandomFloat(0, 1);

    const aiLevel = isFail
      ? null
      : urgency === "high"
        ? "Parah"
        : urgency === "medium"
          ? "Sedang"
          : "Ringan";

    const aiSummary = isFail
      ? "Tidak ada kerusakan jalan yang terdeteksi."
      : `Terdeteksi ${getRandomInt(1, 4)} titik kerusakan (${aiLevel}). Sistem menyarankan perbaikan.`;

    // Tanggal acak dalam 60 hari terakhir
    const daysAgo = getRandomInt(0, 60);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Random Supabase Image (Mocks 1 to 10)
    const imageNumber = getRandomInt(1, 10);
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/report-images/reports/mock-${imageNumber}.jpg`;

    return {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} di ${jalan}`,
      description: `Terdapat jalan ${category} yang sangat ${getRandomItem(ADJECTIVES)} di sekitar ${jalan}. Mohon segera ditindaklanjuti.`,
      address: `${jalan} No. ${getRandomInt(1, 150)}`,
      kelurahan: getRandomItem(loc.kelurahan),
      kecamatan: getRandomItem(loc.kecamatan),
      kota: loc.kota,
      provinsi: loc.provinsi,
      lat: getRandomFloat(loc.lat[0], loc.lat[1]),
      lng: getRandomFloat(loc.lng[0], loc.lng[1]),
      category: category,
      urgency: urgency,
      status: status,
      imageUrl: imageUrl,
      aiScore: aiScore,
      aiLevel: aiLevel,
      aiSummary: aiSummary,
      upvoteCount: getRandomInt(0, 120),
      authorId: users[getRandomItem(userEmails)].id,
      createdAt: createdAt,
      analyzedAt: createdAt,
    };
  });

  await prisma.report.createMany({
    data: reportsToCreate,
    skipDuplicates: true,
  });
  console.log(`   ✅ 100 reports seeded\n`);

  // ─── 4. UPVOTES DUMMY ──────────────────────────────────────────────────────
  console.log("👍 Seeding upvotes...");

  // Ambil semua report yang baru dibuat untuk kita pasangkan upvote-nya
  const allReports = await prisma.report.findMany({ select: { id: true } });
  let upvoteCount = 0;

  for (const rep of allReports) {
    // Beri 0 sampai 4 upvote acak per laporan dari user-user citizen
    const votesToGive = getRandomInt(0, 4);
    const shuffledUsers = [...userEmails].sort(() => 0.5 - Math.random());

    for (let i = 0; i < votesToGive; i++) {
      try {
        await prisma.upvote.create({
          data: {
            userId: users[shuffledUsers[i]].id,
            reportId: rep.id,
          },
        });
        upvoteCount++;
      } catch {
        // Abaikan jika upvote duplicate
      }
    }
  }
  console.log(`   ✅ ${upvoteCount} upvotes seeded\n`);

  // ─── 5. USER BADGES ────────────────────────────────────────────────────────
  console.log("🏅 Seeding user badges...");
  const userBadgesData = [
    { userEmail: "admin@streetwatch.ai", badgeKey: "pelapor_pertama" },
    { userEmail: "admin@streetwatch.ai", badgeKey: "pahlawan_kota" },
    { userEmail: "ali@gmail.com", badgeKey: "pelapor_pertama" },
    { userEmail: "ali@gmail.com", badgeKey: "warga_peduli" },
    { userEmail: "firza@gmail.com", badgeKey: "pelapor_pertama" },
    { userEmail: "della@gmail.com", badgeKey: "pelapor_pertama" },
  ];

  let badgeCount = 0;
  for (const ub of userBadgesData) {
    try {
      await prisma.userBadge.create({
        data: {
          userId: users[ub.userEmail].id,
          badgeId: badges[ub.badgeKey].id,
        },
      });
      badgeCount++;
    } catch {}
  }
  console.log(`   ✅ ${badgeCount} user badges seeded\n`);

  // ─── SUMMARY ───────────────────────────────────────────────────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Seeding selesai! Ringkasan:");
  console.log(`   • ${badgeData.length} badges`);
  console.log(`   • ${usersData.length} users`);
  console.log(`   • 100 reports`);
  console.log(`   • ${upvoteCount} upvotes`);
  console.log(`   • ${badgeCount} user badges`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("🔑 Akun tersedia:");
  console.log("   Admin  → admin@streetwatch.ai  / Admin123!");
  console.log("   User 1 → ali@gmail.com         / Password123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
