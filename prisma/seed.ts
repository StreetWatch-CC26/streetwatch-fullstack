import {
  Role,
  Urgency,
  ReportStatus,
  DamageCategory,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
      image: null,
    },
    {
      name: "Ali Musthafa Kamal",
      email: "ali@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 620,
      image: null,
    },
    {
      name: "Firza Hakim",
      email: "firza@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 340,
      image: null,
    },
    {
      name: "Della Nurizki",
      email: "della@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 180,
      image: null,
    },
    {
      name: "Dzakiya Hakima Adila",
      email: "dzakiya@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 95,
      image: null,
    },
    {
      name: "Alif Budi Setiyawan",
      email: "alif@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 50,
      image: null,
    },
    {
      name: "Rangga Adi",
      email: "rangga@gmail.com",
      password: passwordHash,
      role: Role.CITIZEN,
      points: 10,
      image: null,
    },
  ];

  const users: Record<string, { id: string }> = {};
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, points: u.points },
      create: u,
    });
    users[u.email] = user;
  }
  console.log(`   ✅ ${usersData.length} users seeded\n`);

  // ─── 3. REPORTS ────────────────────────────────────────────────────────────
  console.log("📋 Seeding reports...");

  const now = new Date();
  const daysAgo = (n: number) =>
    new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  const reportsData = [
    // ── Pekanbaru, Riau
    {
      title: "Jalan Sudirman Berlubang Besar",
      description:
        "Terdapat lubang besar di Jalan Sudirman dekat pertigaan. Lubang sedalam ±30cm sangat membahayakan pengendara motor pada malam hari karena tidak ada penerangan. Sudah ada 2 motor yang terperosok minggu ini.",
      address: "Jl. Sudirman No. 45, Pekanbaru",
      kelurahan: "Jadirejo",
      kecamatan: "Sukajadi",
      kota: "Pekanbaru",
      provinsi: "Riau",
      lat: 0.5071,
      lng: 101.4478,
      urgency: Urgency.high,
      status: ReportStatus.verified,
      category: DamageCategory.lubang,
      imageUrls: [
        "https://placehold.co/800x600/e74c3c/white?text=Lubang+Jalan",
      ],
      upvoteCount: 47,
      aiScore: 92.5,
      aiLevel: "tinggi",
      aiSummary:
        "Terdeteksi lubang besar dengan kedalaman signifikan. Risiko tinggi bagi pengendara.",
      analyzedAt: daysAgo(5),
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(7),
    },
    {
      title: "Aspal Retak Parah di Jalan Gajah Mada",
      description:
        "Aspal di Jalan Gajah Mada mengalami retak-retak memanjang sepanjang ±50 meter. Jika hujan, air menggenang di retakan dan menjadi licin.",
      address: "Jl. Gajah Mada, Pekanbaru",
      kelurahan: "Wonorejo",
      kecamatan: "Marpoyan Damai",
      kota: "Pekanbaru",
      provinsi: "Riau",
      lat: 0.496,
      lng: 101.4353,
      urgency: Urgency.high,
      status: ReportStatus.verified,
      category: DamageCategory.retak,
      imageUrls: ["https://placehold.co/800x600/e67e22/white?text=Retak+Aspal"],
      upvoteCount: 23,
      aiScore: 85.0,
      aiLevel: "tinggi",
      aiSummary:
        "Retak permukaan luas terdeteksi. Perlu perbaikan segera sebelum musim hujan.",
      analyzedAt: daysAgo(3),
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(10),
    },
    {
      title: "Jalan Ambles di Perumahan Panam",
      description:
        "Badan jalan mengalami penurunan (ambles) sekitar 20cm di kawasan Panam. Diduga akibat gorong-gorong bawah tanah yang rusak.",
      address: "Jl. HR. Soebrantas KM 12, Panam, Pekanbaru",
      kelurahan: "Tuah Karya",
      kecamatan: "Tampan",
      kota: "Pekanbaru",
      provinsi: "Riau",
      lat: 0.4534,
      lng: 101.3801,
      urgency: Urgency.high,
      status: ReportStatus.fail,
      category: DamageCategory.amblas,
      imageUrls: [
        "https://placehold.co/800x600/c0392b/white?text=Jalan+Ambles",
      ],
      upvoteCount: 38,
      aiScore: null,
      aiLevel: null,
      aiSummary: null,
      analyzedAt: null,
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(2),
    },

    // ── Medan, Sumatera Utara
    {
      title: "Lubang di Jalan Pemuda Medan",
      description:
        "Lubang berdiameter ±1 meter di tengah jalan Pemuda Medan. Sudah ditandai warga dengan bambu tapi belum diperbaiki selama 2 minggu.",
      address: "Jl. Pemuda No. 12, Medan",
      kelurahan: "Petisah Tengah",
      kecamatan: "Medan Petisah",
      kota: "Medan",
      provinsi: "Sumatera Utara",
      lat: 3.5952,
      lng: 98.6722,
      urgency: Urgency.high,
      status: ReportStatus.verified,
      category: DamageCategory.lubang,
      imageUrls: [
        "https://placehold.co/800x600/e74c3c/white?text=Lubang+Medan",
      ],
      upvoteCount: 31,
      aiScore: 88.0,
      aiLevel: "tinggi",
      aiSummary: "Lubang berukuran sedang-besar. Perlu penanganan segera.",
      analyzedAt: daysAgo(4),
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(14),
    },
    {
      title: "Jalan Bergelombang di Ring Road Medan",
      description:
        "Permukaan jalan ring road luar tidak rata dan bergelombang sepanjang 200 meter. Menyebabkan kendaraan berat sering oleng.",
      address: "Jl. Ring Road, Medan",
      kelurahan: "Helvetia",
      kecamatan: "Medan Helvetia",
      kota: "Medan",
      provinsi: "Sumatera Utara",
      lat: 3.62,
      lng: 98.63,
      urgency: Urgency.medium,
      status: ReportStatus.verified,
      category: DamageCategory.bergelombang,
      imageUrls: [
        "https://placehold.co/800x600/f39c12/white?text=Bergelombang",
      ],
      upvoteCount: 15,
      aiScore: 76.5,
      aiLevel: "sedang",
      aiSummary:
        "Deformasi permukaan terdeteksi. Tidak mengancam jiwa namun perlu perbaikan.",
      analyzedAt: daysAgo(6),
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(20),
    },

    // ── Jakarta
    {
      title: "Longsor Tepi Jalan di Cilandak",
      description:
        "Tebing di sisi kiri Jalan Cilandak Raya longsor sekitar 3 meter menutupi sebagian badan jalan. Hanya tersisa 1 lajur.",
      address: "Jl. Cilandak KKO, Jakarta Selatan",
      kelurahan: "Cilandak Timur",
      kecamatan: "Pasar Minggu",
      kota: "Jakarta Selatan",
      provinsi: "DKI Jakarta",
      lat: -6.2888,
      lng: 106.8172,
      urgency: Urgency.high,
      status: ReportStatus.verified,
      category: DamageCategory.longsor,
      imageUrls: ["https://placehold.co/800x600/8e44ad/white?text=Longsor"],
      upvoteCount: 62,
      aiScore: 96.0,
      aiLevel: "tinggi",
      aiSummary:
        "Longsor signifikan terdeteksi. Menutup sebagian jalur. Penanganan darurat diperlukan.",
      analyzedAt: daysAgo(1),
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(1),
    },
    {
      title: "Retak Memanjang di Jalan Casablanca",
      description:
        "Retak memanjang sepanjang 30 meter di Jalan Casablanca arah Kuningan. Lebar retakan sudah mencapai 3cm dan terus melebar.",
      address: "Jl. Casablanca Raya, Jakarta Selatan",
      kelurahan: "Tebet Timur",
      kecamatan: "Tebet",
      kota: "Jakarta Selatan",
      provinsi: "DKI Jakarta",
      lat: -6.2264,
      lng: 106.8451,
      urgency: Urgency.high,
      status: ReportStatus.fail,
      category: DamageCategory.retak,
      imageUrls: [
        "https://placehold.co/800x600/e67e22/white?text=Retak+Jakarta",
      ],
      upvoteCount: 19,
      aiScore: null,
      aiLevel: null,
      aiSummary: null,
      analyzedAt: null,
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(3),
    },

    // ── Surabaya
    {
      title: "Lubang Berbahaya di Jalan Ahmad Yani Surabaya",
      description:
        "Lubang dalam di tengah jalan Ahmad Yani. Sudah ada 3 kecelakaan kecil dalam seminggu terakhir. Lokasi dekat lampu merah padat.",
      address: "Jl. Ahmad Yani No. 150, Surabaya",
      kelurahan: "Gayungan",
      kecamatan: "Gayungan",
      kota: "Surabaya",
      provinsi: "Jawa Timur",
      lat: -7.3305,
      lng: 112.7399,
      urgency: Urgency.high,
      status: ReportStatus.verified,
      category: DamageCategory.lubang,
      imageUrls: [
        "https://placehold.co/800x600/e74c3c/white?text=Lubang+Surabaya",
      ],
      upvoteCount: 54,
      aiScore: 91.0,
      aiLevel: "tinggi",
      aiSummary:
        "Lubang dalam terdeteksi di area lalu lintas padat. Prioritas tinggi.",
      analyzedAt: daysAgo(2),
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(5),
    },
    {
      title: "Jalan Bergelombang di Kenjeran Surabaya",
      description:
        "Seksi jalan Kenjeran dekat Pantai mengalami kerusakan bergelombang. Truk-truk besar sering menghindari jalur ini.",
      address: "Jl. Kenjeran No. 45, Surabaya",
      kelurahan: "Bulak",
      kecamatan: "Bulak",
      kota: "Surabaya",
      provinsi: "Jawa Timur",
      lat: -7.2344,
      lng: 112.7818,
      urgency: Urgency.medium,
      status: ReportStatus.verified,
      category: DamageCategory.bergelombang,
      imageUrls: [
        "https://placehold.co/800x600/f39c12/white?text=Bergelombang+SBY",
      ],
      upvoteCount: 11,
      aiScore: 72.0,
      aiLevel: "sedang",
      aiSummary:
        "Permukaan tidak rata terdeteksi. Dampak sedang pada kendaraan berat.",
      analyzedAt: daysAgo(8),
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(15),
    },

    // ── Bandung
    {
      title: "Aspal Amblas di Jalan Dago Bandung",
      description:
        "Badan jalan amblas di kawasan Dago Atas. Dugaan saluran air bawah jalan bocor menyebabkan tanah turun. Sangat berbahaya saat malam.",
      address: "Jl. Ir. H. Djuanda (Dago) No. 200, Bandung",
      kelurahan: "Dago",
      kecamatan: "Coblong",
      kota: "Bandung",
      provinsi: "Jawa Barat",
      lat: -6.8772,
      lng: 107.6142,
      urgency: Urgency.high,
      status: ReportStatus.fail,
      category: DamageCategory.amblas,
      imageUrls: [
        "https://placehold.co/800x600/c0392b/white?text=Amblas+Bandung",
      ],
      upvoteCount: 28,
      aiScore: null,
      aiLevel: null,
      aiSummary: null,
      analyzedAt: null,
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(4),
    },
    {
      title: "Kerusakan Lain-lain di Jalan Buah Batu",
      description:
        "Permukaan jalan di Buah Batu mengalami kerusakan campuran: sebagian retak, sebagian berlubang kecil. Kondisi keseluruhan buruk.",
      address: "Jl. Buah Batu No. 80, Bandung",
      kelurahan: "Cijagra",
      kecamatan: "Lengkong",
      kota: "Bandung",
      provinsi: "Jawa Barat",
      lat: -6.938,
      lng: 107.636,
      urgency: Urgency.low,
      status: ReportStatus.verified,
      category: DamageCategory.lainnya,
      imageUrls: [
        "https://placehold.co/800x600/95a5a6/white?text=Kerusakan+Lainnya",
      ],
      upvoteCount: 8,
      aiScore: 65.0,
      aiLevel: "rendah",
      aiSummary:
        "Kerusakan campuran terdeteksi. Tingkat urgensi rendah namun perlu dimonitor.",
      analyzedAt: daysAgo(10),
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(25),
    },
    // Laporan baru tanpa verifikasi
    {
      title: "Lubang Kecil di Jalan Diponegoro Pekanbaru",
      description:
        "Ada beberapa lubang kecil di Jalan Diponegoro dekat taman kota. Tidak terlalu dalam tapi berpotensi membesar.",
      address: "Jl. Diponegoro, Pekanbaru",
      kelurahan: "Sumahilang",
      kecamatan: "Pekanbaru Kota",
      kota: "Pekanbaru",
      provinsi: "Riau",
      lat: 0.533,
      lng: 101.4512,
      urgency: Urgency.low,
      status: ReportStatus.fail,
      category: DamageCategory.lubang,
      imageUrls: [
        "https://placehold.co/800x600/3498db/white?text=Lubang+Kecil",
      ],
      upvoteCount: 5,
      aiScore: null,
      aiLevel: null,
      aiSummary: null,
      analyzedAt: null,
      authorEmail: "ali@gmail.com",
      createdAt: daysAgo(1),
    },
  ];

  const createdReports: { id: string; title: string }[] = [];
  for (const r of reportsData) {
    const { authorEmail, createdAt, ...reportFields } = r;
    const report = await prisma.report.create({
      data: {
        ...reportFields,
        authorId: users[authorEmail].id,
        createdAt,
      },
    });
    createdReports.push({ id: report.id, title: report.title });
  }
  console.log(`   ✅ ${createdReports.length} reports seeded\n`);

  // ─── 4. UPVOTES ────────────────────────────────────────────────────────────
  console.log("👍 Seeding upvotes...");

  // Buat upvote per user untuk beberapa laporan
  const upvotePairs = [
    { userEmail: "ali@google.com", reportIndex: 3 },
    { userEmail: "ali@google.com", reportIndex: 1 },
    { userEmail: "ali@google.com", reportIndex: 6 },
    { userEmail: "ali@google.com", reportIndex: 0 },
    { userEmail: "firza@google.com", reportIndex: 2 },
    { userEmail: "firza@google.com", reportIndex: 7 },
    { userEmail: "della@google.com", reportIndex: 0 },
    { userEmail: "della@agoogle.com", reportIndex: 5 },
    { userEmail: "della@google.com", reportIndex: 9 },
    { userEmail: "dzakiya@google.com", reportIndex: 1 },
    { userEmail: "dzakiya@google.com", reportIndex: 4 },
    { userEmail: "alif@google.com", reportIndex: 0 },
    { userEmail: "alif@google.com", reportIndex: 3 },
  ];

  let upvoteCount = 0;
  for (const pair of upvotePairs) {
    const report = createdReports[pair.reportIndex];
    if (!report) continue;
    try {
      await prisma.upvote.create({
        data: {
          userId: users[pair.userEmail].id,
          reportId: report.id,
        },
      });
      upvoteCount++;
    } catch {
      // skip duplicate
    }
  }
  console.log(`   ✅ ${upvoteCount} upvotes seeded\n`);

  // ─── 5. USER BADGES ────────────────────────────────────────────────────────
  console.log("🏅 Seeding user badges...");

  const userBadgesData = [
    // Admin — semua badge
    { userEmail: "admin@streetwatch.ai", badgeKey: "pelapor_pertama" },
    { userEmail: "admin@streetwatch.ai", badgeKey: "pelapor_aktif" },
    { userEmail: "admin@streetwatch.ai", badgeKey: "warga_peduli" },
    { userEmail: "admin@streetwatch.ai", badgeKey: "penginspirasi" },
    { userEmail: "admin@streetwatch.ai", badgeKey: "penjaga_kota" },
    { userEmail: "admin@streetwatch.ai", badgeKey: "pahlawan_kota" },

    { userEmail: "ali@gmail.com", badgeKey: "pelapor_pertama" },
    { userEmail: "ali@gmail.com", badgeKey: "warga_peduli" },
    { userEmail: "ali@gmail.com", badgeKey: "penginspirasi" },

    { userEmail: "firza@gmail.com", badgeKey: "pelapor_pertama" },
    { userEmail: "firza@gmail.com", badgeKey: "warga_peduli" },

    { userEmail: "dzakiya@gmail.com", badgeKey: "pelapor_pertama" },

    { userEmail: "della@gmail.com", badgeKey: "pelapor_pertama" },

    { userEmail: "alif@gmail.com", badgeKey: "pelapor_pertama" },
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
    } catch {
      // skip duplicate
    }
  }
  console.log(`   ✅ ${badgeCount} user badges seeded\n`);

  // ─── SUMMARY ───────────────────────────────────────────────────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Seeding selesai! Ringkasan:");
  console.log(`   • ${badgeData.length} badges`);
  console.log(`   • ${usersData.length} users`);
  console.log(`   • ${createdReports.length} reports`);
  console.log(`   • ${upvoteCount} upvotes`);
  console.log(`   • ${badgeCount} user badges`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("🔑 Akun tersedia:");
  console.log("   Admin  → admin@streetwatch.ai  / Admin123!");
  console.log("   User 1 → ali@gmail.com      / Password123");
  console.log("   User 2 → firza@gmail.com      / Password123");
  console.log("   User 3 → della@gmail.com     / Password123");
  console.log("   User 4 → dzakiya@gmail.com      / Password123");
  console.log("   User 5 → alif@gmail.com     / Password123");
  console.log("   User 6 → rangga@gmail.com     / Password123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
