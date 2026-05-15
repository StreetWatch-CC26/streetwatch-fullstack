<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md — StreetWatch Backend Integration Plan

> **Tujuan**: Mengubah seluruh mock data di frontend menjadi data real dengan stack:
> Next.js API Routes (serverless) + Supabase PostgreSQL + Prisma ORM + NextAuth.js +
> Supabase Storage + FastAPI (ML service eksternal).
>
> **Baca dokumen ini dari atas ke bawah. Setiap fase harus selesai sebelum lanjut ke fase berikutnya.**

---

## Keputusan Arsitektur (Hasil Validasi)

| Aspek                       | Keputusan                                                    |
| --------------------------- | ------------------------------------------------------------ |
| Auth provider               | Email + Password + Google OAuth                              |
| Image storage               | Supabase Storage                                             |
| FastAPI communication       | **Sinkron** — Next.js tunggu respons ML sebelum simpan ke DB |
| Akses peta & daftar laporan | **Publik** — tanpa login                                     |
| Upvote & submit laporan     | Butuh login                                                  |
| Role                        | CITIZEN + ADMIN (admin bisa ubah status manual)              |
| Status otomatis             | `verified` setelah FastAPI berhasil analisis                 |

---

## Stack & Versi

```
Next.js          15 (App Router)
TypeScript       5.x
Prisma           7.x
@prisma/client   7.x
next-auth        5.x (Auth.js v5)
@auth/prisma-adapter
Supabase         @supabase/supabase-js v2
zod              3.x
bcryptjs         2.x
```

---

## Struktur Direktori yang Akan Dibuat/Diubah

```
src/
├── app/
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts          ← NextAuth handler
│       ├── reports/
│       │   ├── route.ts              ← GET (list) + POST (create)
│       │   └── [id]/
│       │       ├── route.ts          ← GET (detail)
│       │       └── upvote/
│       │           └── route.ts      ← POST (toggle upvote)
│       ├── analytics/
│       │   └── route.ts              ← GET overview + chart data
│       └── upload/
│           └── route.ts              ← POST upload gambar ke Supabase Storage
│
├── lib/
│   ├── prisma.ts                     ← Prisma client singleton
│   ├── auth.ts                       ← NextAuth config (providers, callbacks)
│   ├── supabase.ts                   ← Supabase client (server-side)
│   └── api-response.ts               ← Helper format JSON response
│
├── services/
│   ├── report.service.ts             ← Business logic laporan
│   ├── upvote.service.ts             ← Toggle upvote + hitung skor
│   ├── fastapi.service.ts            ← HTTP call ke FastAPI ML
│   ├── storage.service.ts            ← Upload/delete gambar Supabase Storage
│   └── analytics.service.ts         ← Query aggregasi untuk dashboard
│
├── repositories/
│   ├── report.repository.ts          ← Prisma queries laporan
│   ├── upvote.repository.ts          ← Prisma queries upvote
│   └── user.repository.ts            ← Prisma queries user
│
├── validations/
│   ├── report.validation.ts          ← Zod schema create report
│   └── auth.validation.ts            ← Zod schema register
│
└── middleware.ts                     ← Auth guard route-level (Next.js middleware)

prisma/
└── schema.prisma                     ← Database schema lengkap
```

---

## FASE 0 — Setup Awal (Prasyarat)

Selesaikan fase ini sebelum menulis satu baris kode pun.

### 0.1 Install Semua Dependensi

```bash
npm install prisma @prisma/client
npm install next-auth@beta @auth/prisma-adapter
npm install @supabase/supabase-js
npm install zod
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 0.2 Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) → New Project → catat:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (**jangan expose ke client**)
   - `Database URL (pooling)` → `DATABASE_URL` untuk Prisma

2. Di Supabase Dashboard → Storage → Create bucket:
   - Nama bucket: `report-images`
   - Access: **Public** (agar URL gambar bisa diakses langsung)
   - Allowed MIME types: `image/jpeg, image/png, image/webp`
   - Max file size: `10MB`

3. Di Supabase Dashboard → Authentication → Providers:
   - Enable **Email** provider
   - Enable **Google** provider → masukkan Client ID & Secret dari Google Console

### 0.3 Setup Google OAuth

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → Enable Google+ API
3. Credentials → OAuth 2.0 Client ID:
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://streetwatch.vercel.app/api/auth/callback/google`
4. Catat `Client ID` dan `Client Secret`

### 0.4 File `.env.local`

Buat file `.env.local` di root project dengan isi:

```env
# ── Database ──────────────────────────────────────────────────────────────────
# Dari Supabase: Settings > Database > Connection string > URI (Transaction pooler)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct connection (dipakai untuk Prisma migrate, bukan runtime)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# ── Supabase ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
SUPABASE_STORAGE_BUCKET="report-images"

# ── NextAuth ──────────────────────────────────────────────────────────────────
# Generate: openssl rand -base64 32
NEXTAUTH_SECRET="generate-32-char-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# ── FastAPI ML Service ────────────────────────────────────────────────────────
FASTAPI_BASE_URL="http://localhost:8000"
# Untuk production: URL deployed FastAPI
# FASTAPI_BASE_URL="https://ml.streetwatch.id"

# ── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## FASE 1 — Database Schema (Prisma)

### File: `prisma/schema.prisma`

Buat file ini dengan konten berikut **persis**:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─── Enums ────────────────────────────────────────────────────────────────────

enum Role {
  CITIZEN
  ADMIN
}

enum Urgency {
  high
  medium
  low
}

enum ReportStatus {
  pending       // baru dibuat, belum dianalisis
  verified      // FastAPI berhasil analisis — status otomatis
}

enum DamageCategory {
  lubang
  retak
  amblas
  longsor
  bergelombang
  lainnya
}

// ─── Models ───────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // null jika login via OAuth
  role          Role      @default(CITIZEN)
  points        Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // NextAuth relations
  accounts Account[]
  sessions Session[]

  // App relations
  reports  Report[]
  upvotes  Upvote[]
  badges   UserBadge[]

  @@map("users")
}

// NextAuth required models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

model Report {
  id          String         @id @default(cuid())
  title       String
  description String         @db.Text
  address     String
  kelurahan   String?
  kecamatan   String?
  kota        String
  provinsi    String
  lat         Float
  lng         Float
  urgency     Urgency        @default(low)
  status      ReportStatus   @default(pending)
  category    DamageCategory
  imageUrls   String[]       // array URL dari Supabase Storage
  upvoteCount Int            @default(0)

  // Hasil analisis FastAPI
  aiScore     Float?         // 0–100 confidence score dari ML
  aiLevel     String?        // rendah | sedang | tinggi
  aiSummary   String?        @db.Text
  analyzedAt  DateTime?      // kapan FastAPI berhasil analisis

  authorId    String
  author      User           @relation(fields: [authorId], references: [id], onDelete: Cascade)

  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  upvotes     Upvote[]

  // Index untuk query peta dan filter
  @@index([provinsi])
  @@index([kota])
  @@index([status])
  @@index([urgency])
  @@index([createdAt])
  @@map("reports")
}

model Upvote {
  id        String   @id @default(cuid())
  userId    String
  reportId  String
  createdAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@unique([userId, reportId])
  @@map("upvotes")
}

model Badge {
  id          String @id @default(cuid())
  key         String @unique
  name        String
  description String
  icon        String
  minReports  Int    @default(0)  // minimum laporan untuk unlock
  minPoints   Int    @default(0)  // minimum poin untuk unlock

  users UserBadge[]

  @@map("badges")
}

model UserBadge {
  userId   String
  badgeId  String
  earnedAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge Badge @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  @@id([userId, badgeId])
  @@map("user_badges")
}
```

### Jalankan Migration

```bash
# Generate Prisma client dari schema
npx prisma generate

# Push schema ke Supabase (development — tanpa migration file)
npx prisma db push

# Verifikasi tabel sudah terbuat
npx prisma studio
# Buka http://localhost:5555 dan pastikan semua tabel ada
```

### Seed Badge Data

Buat file `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const badges = [
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
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: badge,
      create: badge,
    });
  }
  console.log("✅ Badges seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Jalankan:

```bash
npm install -D ts-node
npx prisma db seed
```

---

## FASE 2 — Prisma Client Singleton + Supabase Client

### File: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### File: `src/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

// Client untuk server-side (service role — bypass RLS)
// JANGAN gunakan ini di komponen client
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

// Bucket name
export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "report-images";
```

### File: `src/lib/api-response.ts`

```typescript
import { NextResponse } from "next/server";

export function ok<T>(data: T, meta?: object) {
  return NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    { status: 200 },
  );
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, errors?: object) {
  return NextResponse.json(
    { success: false, message, ...(errors && { errors }) },
    { status: 400 },
  );
}

export function unauthorized(message = "Silakan login terlebih dahulu") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = "Akses tidak diizinkan") {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function notFound(message = "Data tidak ditemukan") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function conflict(message: string) {
  return NextResponse.json({ success: false, message }, { status: 409 });
}

export function serverError(message = "Terjadi kesalahan server") {
  return NextResponse.json({ success: false, message }, { status: 500 });
}
```

---

## FASE 3 — Autentikasi (NextAuth.js v5)

### File: `src/lib/auth.ts`

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "CITIZEN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});

// Augment types — buat file src/types/next-auth.d.ts
// declare module "next-auth" {
//   interface Session {
//     user: { id: string; role: "CITIZEN" | "ADMIN" } & DefaultSession["user"]
//   }
// }
```

Buat file `src/types/next-auth.d.ts`:

```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CITIZEN" | "ADMIN";
      hasPassword: boolean;
      justRegistered?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: "CITIZEN" | "ADMIN";
    hasPassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CITIZEN" | "ADMIN";
    hasPassword?: boolean;
    justRegistered?: boolean;
  }
}
```

### File: `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

### File: `src/middleware.ts` (route-level auth guard)

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Route yang butuh login
const PROTECTED_ROUTES = [
  "/dashboard/report",
  "/dashboard/profile",
  "/dashboard/playground",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
```

### API Route Register: `src/app/api/auth/register/route.ts`

```typescript
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict, created, serverError } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Harus mengandung huruf kapital")
    .regex(/[0-9]/, "Harus mengandung angka"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Data tidak valid", parsed.error.flatten().fieldErrors);
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return conflict("Email sudah terdaftar");

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return created(user);
  } catch (err) {
    console.error("[register]", err);
    return serverError();
  }
}
```

---

## FASE 4 — Storage Service (Upload Gambar)

### File: `src/services/storage.service.ts`

```typescript
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function uploadImageToSupabase(
  file: File,
  folder = "reports",
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Upload gagal: ${error.message}`);

  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteImageFromSupabase(
  publicUrl: string,
): Promise<void> {
  // Extract path dari URL
  // URL format: https://[project].supabase.co/storage/v1/object/public/report-images/reports/xxx.jpg
  const path = publicUrl.split(
    `/storage/v1/object/public/${STORAGE_BUCKET}/`,
  )[1];
  if (!path) return;

  await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path]);
}
```

### API Route Upload: `src/app/api/upload/route.ts`

```typescript
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImageToSupabase } from "@/services/storage.service";
import {
  badRequest,
  created,
  unauthorized,
  serverError,
} from "@/lib/api-response";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) return badRequest("Tidak ada gambar yang dikirim");
    if (files.length > 4) return badRequest("Maksimal 4 gambar per laporan");

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type))
        return badRequest(`Tipe file tidak didukung: ${file.type}`);
      if (file.size > MAX_SIZE_BYTES)
        return badRequest(`Ukuran file terlalu besar: ${file.name}`);
    }

    const urls = await Promise.all(
      files.map((f) => uploadImageToSupabase(f, "reports")),
    );

    return created({ urls });
  } catch (err) {
    console.error("[upload]", err);
    return serverError("Upload gambar gagal");
  }
}
```

---

## FASE 5 — FastAPI Service

### File: `src/services/fastapi.service.ts`

```typescript
/**
 * Kontrak dengan FastAPI ML Service:
 *
 * POST /analyze
 * Content-Type: multipart/form-data
 * Body: { image: File }
 *
 * Response 200:
 * {
 *   "is_damage_detected": boolean,
 *   "category": "lubang" | "retak" | "amblas" | "longsor" | "bergelombang" | "lainnya",
 *   "urgency": "critical" | "high" | "medium" | "low",
 *   "level": "rendah" | "sedang" | "tinggi",
 *   "score": number,          // 0–100
 *   "summary": string,
 *   "recommendations": string[]
 * }
 */

export interface FastAPIAnalysisResult {
  is_damage_detected: boolean;
  category: string;
  urgency: string;
  level: string;
  score: number;
  summary: string;
  recommendations: string[];
}

export async function analyzeImageWithFastAPI(
  imageUrl: string,
): Promise<FastAPIAnalysisResult> {
  const baseUrl = process.env.FASTAPI_BASE_URL;
  if (!baseUrl) throw new Error("FASTAPI_BASE_URL tidak dikonfigurasi");

  // Unduh gambar dari Supabase Storage lalu kirim ke FastAPI sebagai file
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) throw new Error("Gagal mengunduh gambar dari storage");

  const imageBlob = await imageResponse.blob();
  const fileName = imageUrl.split("/").pop() ?? "image.jpg";
  const formData = new FormData();
  formData.append("image", imageBlob, fileName);

  const response = await fetch(`${baseUrl}/analyze`, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(30_000), // timeout 30 detik
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(`FastAPI error ${response.status}: ${errText}`);
  }

  const result: FastAPIAnalysisResult = await response.json();
  return result;
}
```

---

## FASE 6 — Repositories

### File: `src/repositories/report.repository.ts`

```typescript
import { prisma } from "@/lib/prisma";
import type {
  Prisma,
  DamageCategory,
  Urgency,
  ReportStatus,
} from "@prisma/client";

export interface ReportFilters {
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  urgency?: Urgency;
  status?: ReportStatus;
  category?: DamageCategory;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sort:
    | "createdAt_desc"
    | "createdAt_asc"
    | "upvoteCount_desc"
    | "aiScore_desc";
}

function buildOrderBy(
  sort: PaginationOptions["sort"],
): Prisma.ReportOrderByWithRelationInput {
  switch (sort) {
    case "upvoteCount_desc":
      return { upvoteCount: "desc" };
    case "aiScore_desc":
      return { aiScore: "desc" };
    case "createdAt_asc":
      return { createdAt: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

export const reportRepository = {
  async findMany(filters: ReportFilters, pagination: PaginationOptions) {
    const where: Prisma.ReportWhereInput = {
      ...(filters.provinsi && {
        provinsi: { contains: filters.provinsi, mode: "insensitive" },
      }),
      ...(filters.kota && {
        kota: { contains: filters.kota, mode: "insensitive" },
      }),
      ...(filters.kecamatan && {
        kecamatan: { contains: filters.kecamatan, mode: "insensitive" },
      }),
      ...(filters.urgency && { urgency: filters.urgency }),
      ...(filters.status && { status: filters.status }),
      ...(filters.category && { category: filters.category }),
    };

    const skip = (pagination.page - 1) * pagination.limit;

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: buildOrderBy(pagination.sort),
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { upvotes: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { data, total };
  },

  // Endpoint peta — hanya field yang dibutuhkan marker
  async findForMap(filters: Pick<ReportFilters, "provinsi" | "kota">) {
    const where: Prisma.ReportWhereInput = {
      ...(filters.provinsi && {
        provinsi: { contains: filters.provinsi, mode: "insensitive" },
      }),
      ...(filters.kota && {
        kota: { contains: filters.kota, mode: "insensitive" },
      }),
    };

    return prisma.report.findMany({
      where,
      select: {
        id: true,
        title: true,
        lat: true,
        lng: true,
        urgency: true,
        status: true,
        category: true,
        upvoteCount: true,
        aiScore: true,
      },
      take: 1000, // batas marker peta
    });
  },

  async findById(id: string, userId?: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { upvotes: true } },
        upvotes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });
    return report;
  },

  async create(data: Prisma.ReportCreateInput) {
    return prisma.report.create({ data });
  },

  async updateAIResult(
    id: string,
    ai: {
      urgency: Urgency;
      category: DamageCategory;
      aiScore: number;
      aiLevel: string;
      aiSummary: string;
      analyzedAt: Date;
      status: ReportStatus;
    },
  ) {
    return prisma.report.update({ where: { id }, data: ai });
  },

  async updateStatus(id: string, status: ReportStatus) {
    return prisma.report.update({ where: { id }, data: { status } });
  },

  async incrementUpvote(id: string, delta: 1 | -1) {
    return prisma.report.update({
      where: { id },
      data: { upvoteCount: { increment: delta } },
    });
  },

  async findByAuthor(
    authorId: string,
    pagination: Pick<PaginationOptions, "page" | "limit">,
  ) {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where: { authorId },
        skip,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.report.count({ where: { authorId } }),
    ]);
    return { data, total };
  },
};
```

### File: `src/repositories/upvote.repository.ts`

```typescript
import { prisma } from "@/lib/prisma";

export const upvoteRepository = {
  async findOne(userId: string, reportId: string) {
    return prisma.upvote.findUnique({
      where: { userId_reportId: { userId, reportId } },
    });
  },

  async create(userId: string, reportId: string) {
    return prisma.upvote.create({ data: { userId, reportId } });
  },

  async delete(userId: string, reportId: string) {
    return prisma.upvote.delete({
      where: { userId_reportId: { userId, reportId } },
    });
  },

  async findByUser(userId: string) {
    const upvotes = await prisma.upvote.findMany({
      where: { userId },
      select: { reportId: true },
    });
    return upvotes.map((u) => u.reportId);
  },
};
```

---

## FASE 7 — Services (Business Logic)

### File: `src/services/report.service.ts`

```typescript
import { reportRepository } from "@/repositories/report.repository";
import { analyzeImageWithFastAPI } from "@/services/fastapi.service";
import type {
  ReportFilters,
  PaginationOptions,
} from "@/repositories/report.repository";
import type { DamageCategory, Urgency } from "@prisma/client";

export const reportService = {
  async getAll(filters: ReportFilters, pagination: PaginationOptions) {
    return reportRepository.findMany(filters, pagination);
  },

  async getForMap(filters: Pick<ReportFilters, "provinsi" | "kota">) {
    return reportRepository.findForMap(filters);
  },

  async getById(id: string, userId?: string) {
    const report = await reportRepository.findById(id, userId);
    if (!report) throw new Error("NOT_FOUND");
    return report;
  },

  /**
   * Alur create:
   * 1. Simpan laporan ke DB dengan status `pending` dan imageUrls yang sudah diupload
   * 2. Panggil FastAPI secara sinkron menggunakan URL gambar pertama
   * 3. Update laporan dengan hasil AI: urgency, category, aiScore, aiLevel, aiSummary
   * 4. Set status → `verified` (FastAPI berhasil)
   * 5. Return laporan yang sudah di-update
   */
  async create(
    authorId: string,
    data: {
      title: string;
      description: string;
      address: string;
      kelurahan?: string;
      kecamatan?: string;
      kota: string;
      provinsi: string;
      lat: number;
      lng: number;
      category: DamageCategory;
      imageUrls: string[];
    },
  ) {
    // Step 1: simpan ke DB dengan status pending
    const report = await reportRepository.create({
      ...data,
      status: "pending",
      urgency: "low", // default sebelum AI hasil
      author: { connect: { id: authorId } },
    });

    // Step 2: analisis dengan FastAPI (sinkron)
    try {
      const ai = await analyzeImageWithFastAPI(data.imageUrls[0]);

      // Step 3 & 4: update hasil AI + set status verified
      const updated = await reportRepository.updateAIResult(report.id, {
        urgency: ai.urgency as Urgency,
        category: ai.category as DamageCategory,
        aiScore: ai.score,
        aiLevel: ai.level,
        aiSummary: ai.summary,
        analyzedAt: new Date(),
        status: "verified",
      });

      return updated;
    } catch (aiError) {
      // FastAPI gagal — laporan tetap tersimpan dengan status `pending`
      // Jangan gagalkan seluruh request, cukup log error
      console.error("[FastAPI analyze error]", aiError);
      return report;
    }
  },

  async updateStatus(id: string, status: string) {
    return reportRepository.updateStatus(id, status as any);
  },
};
```

### File: `src/services/upvote.service.ts`

```typescript
import { upvoteRepository } from "@/repositories/upvote.repository";
import { reportRepository } from "@/repositories/report.repository";

export const upvoteService = {
  /**
   * Toggle upvote — idempotent.
   * Jika sudah upvote: hapus (un-upvote).
   * Jika belum: tambah.
   * Selalu update upvoteCount di report secara atomik.
   */
  async toggle(userId: string, reportId: string) {
    const existing = await upvoteRepository.findOne(userId, reportId);

    if (existing) {
      await upvoteRepository.delete(userId, reportId);
      const updated = await reportRepository.incrementUpvote(reportId, -1);
      return { upvoted: false, upvoteCount: updated.upvoteCount };
    } else {
      await upvoteRepository.create(userId, reportId);
      const updated = await reportRepository.incrementUpvote(reportId, 1);
      return { upvoted: true, upvoteCount: updated.upvoteCount };
    }
  },

  async getUserUpvoted(userId: string) {
    return upvoteRepository.findByUser(userId);
  },
};
```

### File: `src/services/analytics.service.ts`

```typescript
import { prisma } from "@/lib/prisma";

export const analyticsService = {
  async getOverview() {
    const [total, byStatus] = await Promise.all([
      prisma.report.count(),
      prisma.report.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    const counts = Object.fromEntries(
      byStatus.map((r) => [r.status, r._count._all]),
    );

    return {
      totalReports: total,
      pendingReports: counts.pending ?? 0,
      verifiedReports: counts.verified ?? 0,
      inProgress: counts.in_progress ?? 0,
      resolvedReports: counts.resolved ?? 0,
      resolveRate:
        total > 0 ? Math.round(((counts.resolved ?? 0) / total) * 100) : 0,
    };
  },

  // Chart pelaporan bulanan (default 12 bulan terakhir)
  async getMonthlyTrend(months = 12) {
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const reports = await prisma.report.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, status: true },
    });

    // Group secara manual karena Prisma tidak support date_trunc langsung
    const grouped: Record<string, { total: number; resolved: number }> = {};

    for (const r of reports) {
      const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[key]) grouped[key] = { total: 0, resolved: 0 };
      grouped[key].total++;
      if (r.status === "resolved") grouped[key].resolved++;
    }

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => {
        const [year, month] = key.split("-");
        return { year: Number(year), month: Number(month), ...val };
      });
  },

  // Lokasi jalan rusak terbanyak (groupBy kota)
  async getTopLocations(limit = 10) {
    return prisma.report.groupBy({
      by: ["kota", "provinsi"],
      _count: { _all: true },
      orderBy: { _count: { kota: "desc" } },
      take: limit,
    });
  },

  // Breakdown kategori
  async getCategoryBreakdown() {
    const result = await prisma.report.groupBy({
      by: ["category"],
      _count: { _all: true },
    });
    const total = result.reduce((s, r) => s + r._count._all, 0);
    return result.map((r) => ({
      category: r.category,
      count: r._count._all,
      pct: total > 0 ? Math.round((r._count._all / total) * 100) : 0,
    }));
  },
};
```

---

## FASE 8 — Validations

### File: `src/validations/report.validation.ts`

```typescript
import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(100),
  description: z.string().min(20, "Deskripsi minimal 20 karakter").max(1000),
  address: z.string().min(3).max(200),
  kelurahan: z.string().max(100).optional(),
  kecamatan: z.string().max(100).optional(),
  kota: z.string().min(2, "Kota wajib diisi").max(100),
  provinsi: z.string().min(2, "Provinsi wajib diisi").max(100),
  lat: z.number().min(-11, "Koordinat tidak valid").max(6),
  lng: z.number().min(95, "Koordinat tidak valid").max(141),
  category: z.enum([
    "lubang",
    "retak",
    "amblas",
    "longsor",
    "bergelombang",
    "lainnya",
  ]),
  imageUrls: z
    .array(z.string().url())
    .min(1, "Minimal 1 foto")
    .max(4, "Maksimal 4 foto"),
});

export const reportQuerySchema = z.object({
  provinsi: z.string().optional(),
  kota: z.string().optional(),
  kecamatan: z.string().optional(),
  urgency: z.enum(["critical", "high", "medium", "low"]).optional(),
  status: z.enum(["pending", "verified", "in_progress", "resolved"]).optional(),
  category: z
    .enum(["lubang", "retak", "amblas", "longsor", "bergelombang", "lainnya"])
    .optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  sort: z
    .enum([
      "createdAt_desc",
      "createdAt_asc",
      "upvoteCount_desc",
      "aiScore_desc",
    ])
    .default("createdAt_desc"),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
```

---

## FASE 9 — API Routes

### File: `src/app/api/reports/route.ts`

```typescript
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { reportService } from "@/services/report.service";
import {
  createReportSchema,
  reportQuerySchema,
} from "@/validations/report.validation";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  serverError,
} from "@/lib/api-response";

// GET /api/reports — publik, mendukung filter & pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = reportQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!query.success)
      return badRequest(
        "Parameter tidak valid",
        query.error.flatten().fieldErrors,
      );

    const { page, limit, sort, ...filters } = query.data;
    const { data, total } = await reportService.getAll(filters, {
      page,
      limit,
      sort,
    });

    const totalPages = Math.ceil(total / limit);
    return ok(data, {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("[GET /reports]", err);
    return serverError();
  }
}

// POST /api/reports — butuh login
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const parsed = createReportSchema.safeParse(body);
    if (!parsed.success)
      return badRequest("Data tidak valid", parsed.error.flatten().fieldErrors);

    const report = await reportService.create(session.user.id, parsed.data);
    return created(report);
  } catch (err) {
    console.error("[POST /reports]", err);
    return serverError();
  }
}
```

### File: `src/app/api/reports/[id]/route.ts`

```typescript
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { reportService } from "@/services/report.service";
import {
  ok,
  notFound,
  unauthorized,
  forbidden,
  serverError,
  badRequest,
} from "@/lib/api-response";
import { z } from "zod";

// GET /api/reports/[id] — publik
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    const report = await reportService.getById(params.id, session?.user.id);
    return ok(report);
  } catch (err: any) {
    if (err.message === "NOT_FOUND") return notFound("Laporan tidak ditemukan");
    return serverError();
  }
}

// PATCH /api/reports/[id] — hanya ADMIN
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) return unauthorized();
  if ((session.user as any).role !== "ADMIN") return forbidden();

  try {
    const body = await req.json();
    const schema = z.object({
      status: z.enum(["pending", "verified", "in_progress", "resolved"]),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest("Status tidak valid");

    const updated = await reportService.updateStatus(
      params.id,
      parsed.data.status,
    );
    return ok(updated);
  } catch (err) {
    return serverError();
  }
}
```

### File: `src/app/api/reports/[id]/upvote/route.ts`

```typescript
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { upvoteService } from "@/services/upvote.service";
import { ok, unauthorized, serverError } from "@/lib/api-response";

// POST /api/reports/[id]/upvote — toggle, butuh login
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const result = await upvoteService.toggle(session.user.id, params.id);
    return ok(result);
  } catch (err) {
    console.error("[upvote toggle]", err);
    return serverError();
  }
}
```

### File: `src/app/api/reports/map/route.ts`

```typescript
import { NextRequest } from "next/server";
import { reportRepository } from "@/repositories/report.repository";
import { ok, serverError } from "@/lib/api-response";

// GET /api/reports/map?provinsi=Riau&kota=Kota+Pekanbaru
// Publik — return minimal fields untuk marker peta
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const provinsi = searchParams.get("provinsi") ?? undefined;
    const kota = searchParams.get("kota") ?? undefined;

    const data = await reportRepository.findForMap({ provinsi, kota });
    return ok(data);
  } catch (err) {
    console.error("[GET /reports/map]", err);
    return serverError();
  }
}
```

### File: `src/app/api/analytics/route.ts`

```typescript
import { NextRequest } from "next/server";
import { analyticsService } from "@/services/analytics.service";
import { ok, serverError } from "@/lib/api-response";

// GET /api/analytics?type=overview|monthly|locations|categories
export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") ?? "overview";
    const months = Number(req.nextUrl.searchParams.get("months") ?? 12);

    switch (type) {
      case "monthly":
        return ok(await analyticsService.getMonthlyTrend(months));
      case "locations":
        return ok(await analyticsService.getTopLocations());
      case "categories":
        return ok(await analyticsService.getCategoryBreakdown());
      default:
        return ok(await analyticsService.getOverview());
    }
  } catch (err) {
    console.error("[analytics]", err);
    return serverError();
  }
}
```

---

## FASE 10 — Update Frontend: Hapus Mock Data

Setelah semua API route siap, lakukan perubahan berikut di frontend.

### 10.1 Ganti `mockReports` dengan fetch di Map Page

Di `app/dashboard/map/page.tsx` (atau `peta/page.tsx`), ganti:

```typescript
// SEBELUM
import { MOCK_REPORTS } from "@/data/mock-reports";

// SESUDAH — fetch saat komponen mount
const [reports, setReports] = useState([]);

useEffect(() => {
  async function load() {
    const res = await fetch(
      `/api/reports/map?${new URLSearchParams({ provinsi: filter.provinsi?.nama ?? "", kota: filter.kabupaten?.nama ?? "" })}`,
    );
    const json = await res.json();
    setReports(json.data);
  }
  load();
}, [filter.selectedProvinsi, filter.selectedKabupaten]);
```

### 10.2 Ganti upvote mock dengan API call

Di `hooks/useUpvotes.ts`:

```typescript
// SEBELUM: in-memory toggle
// SESUDAH: API call + optimistic update

const toggle = useCallback(async (reportId: string) => {
  // Optimistic update
  setVoted((prev) => { ... });
  setCounts((prev) => { ... });

  try {
    const res = await fetch(`/api/reports/${reportId}/upvote`, { method: "POST" });
    const json = await res.json();
    // Sync dengan nilai aktual dari server
    setCounts((prev) => ({ ...prev, [reportId]: json.data.upvoteCount }));
    setVoted((prev) => {
      const next = new Set(prev);
      json.data.upvoted ? next.add(reportId) : next.delete(reportId);
      return next;
    });
  } catch {
    // Rollback optimistic update jika gagal
    ...
  }
}, []);
```

### 10.3 Form Submit Laporan — alur baru

Di `app/dashboard/report/new/page.tsx`:

```typescript
// Alur baru:
// 1. Upload gambar ke /api/upload → dapat array URL
// 2. Submit form ke /api/reports dengan imageUrls dari step 1
// 3. Backend otomatis panggil FastAPI → simpan hasil → return report

async function handleSubmit() {
  // Step 1: upload gambar
  const formData = new FormData();
  images.forEach((file) => formData.append("images", file));
  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const uploadJson = await uploadRes.json();
  const imageUrls: string[] = uploadJson.data.urls;

  // Step 2: submit laporan
  const reportRes = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      address,
      kota,
      provinsi,
      lat,
      lng,
      category,
      imageUrls,
    }),
  });
  const reportJson = await reportRes.json();
  // reportJson.data sudah mengandung hasil AI (aiScore, aiLevel, urgency)
}
```

### 10.4 Analytics Page

```typescript
// Fetch data aktual
const [overview, setOverview] = useState(null);
const [monthly, setMonthly] = useState([]);
const [locations, setLocations] = useState([]);

useEffect(() => {
  Promise.all([
    fetch("/api/analytics?type=overview").then((r) => r.json()),
    fetch("/api/analytics?type=monthly&months=12").then((r) => r.json()),
    fetch("/api/analytics?type=locations").then((r) => r.json()),
  ]).then(([ov, mo, lo]) => {
    setOverview(ov.data);
    setMonthly(mo.data);
    setLocations(lo.data);
  });
}, []);
```

---

## Checklist Eksekusi (Urutan Wajib)

Centang setiap item sebelum lanjut ke item berikutnya.

### Fase 0

- [ ] Semua npm packages terinstall
- [ ] Project Supabase dibuat, bucket `report-images` ada dan public
- [ ] Google OAuth dikonfigurasi di Google Console + Supabase
- [ ] File `.env.local` lengkap dan benar

### Fase 1

- [ ] `prisma/schema.prisma` dibuat
- [ ] `npx prisma generate` berhasil
- [ ] `npx prisma db push` berhasil — semua tabel ada di Supabase
- [ ] `npx prisma db seed` berhasil — badge data terseed
- [ ] `npx prisma studio` — verifikasi tabel secara visual

### Fase 2

- [ ] `src/lib/prisma.ts` dibuat
- [ ] `src/lib/supabase.ts` dibuat
- [ ] `src/lib/api-response.ts` dibuat

### Fase 3

- [ ] `src/lib/auth.ts` dibuat
- [ ] `src/types/next-auth.d.ts` dibuat
- [ ] `src/app/api/auth/[...nextauth]/route.ts` dibuat
- [ ] `src/app/api/auth/register/route.ts` dibuat
- [ ] `src/middleware.ts` dibuat
- [ ] **Test**: POST `/api/auth/register` dengan email baru → `201`
- [ ] **Test**: POST `/api/auth/signin` (via NextAuth) → redirect ke dashboard
- [ ] **Test**: Login via Google → berhasil, user tersimpan di DB

### Fase 4

- [ ] `src/services/storage.service.ts` dibuat
- [ ] `src/app/api/upload/route.ts` dibuat
- [ ] **Test**: POST `/api/upload` dengan 1 gambar → URL Supabase dikembalikan
- [ ] **Test**: URL gambar bisa diakses publik di browser

### Fase 5

- [ ] `src/services/fastapi.service.ts` dibuat
- [ ] **Test**: FastAPI berjalan di `FASTAPI_BASE_URL` → `GET /health` return `200`
- [ ] **Test**: `analyzeImageWithFastAPI` dipanggil langsung → return JSON yang sesuai kontrak

### Fase 6 & 7

- [ ] `src/repositories/report.repository.ts` dibuat
- [ ] `src/repositories/upvote.repository.ts` dibuat
- [ ] `src/services/report.service.ts` dibuat
- [ ] `src/services/upvote.service.ts` dibuat
- [ ] `src/services/analytics.service.ts` dibuat

### Fase 8

- [ ] `src/validations/report.validation.ts` dibuat

### Fase 9

- [ ] `src/app/api/reports/route.ts` dibuat
- [ ] `src/app/api/reports/[id]/route.ts` dibuat
- [ ] `src/app/api/reports/[id]/upvote/route.ts` dibuat
- [ ] `src/app/api/reports/map/route.ts` dibuat
- [ ] `src/app/api/analytics/route.ts` dibuat
- [ ] **Test API**: `GET /api/reports` → `{ success: true, data: [], meta: {...} }`
- [ ] **Test API**: `POST /api/reports` (dengan auth) → laporan tersimpan, FastAPI dipanggil
- [ ] **Test API**: `POST /api/reports/:id/upvote` → toggle berhasil, count terupdate
- [ ] **Test API**: `GET /api/reports/map` → array marker minimal
- [ ] **Test API**: `GET /api/analytics?type=overview` → data aggregasi

### Fase 10

- [ ] Map page: data dari `/api/reports/map`
- [ ] Report form: alur upload → submit → hasil AI ditampilkan
- [ ] Upvote: API call dengan optimistic update
- [ ] Analytics page: data dari `/api/analytics`
- [ ] Hapus semua import dari `@/data/mock-reports` dan `@/lib/dashboard-data`

---

## Catatan Penting

**FastAPI Timeout** — Default timeout di `fastapi.service.ts` adalah 30 detik. Jika ML model lebih lambat, naikan ke 60 detik. Jangan lewati 60 detik karena Vercel serverless functions memiliki batas 60 detik di free tier.

**Prisma di Vercel** — Pastikan `DATABASE_URL` menggunakan **transaction pooler** dari Supabase (port 6543), bukan direct connection. Serverless butuh connection pooling.

**Gambar di Supabase Storage** — Semua gambar di bucket `report-images` harus public. Verifikasi di Supabase Dashboard → Storage → Policies bahwa ada policy `SELECT` untuk `anon` role.

**NextAuth Session Strategy** — Gunakan `jwt` (bukan `database`) karena lebih efisien untuk serverless — tidak ada query DB untuk setiap request yang butuh auth.

**Upvote Race Condition** — `upvoteCount` di-update langsung di kolom report (bukan dihitung dari relasi) untuk performa peta. Ada risiko race condition kecil jika banyak upvote bersamaan — acceptable untuk MVP.

<!-- END:nextjs-agent-rules -->
