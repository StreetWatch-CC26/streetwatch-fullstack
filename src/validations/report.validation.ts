// src/validations/report.validation.ts
import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(100),
  description: z.string().max(1000).optional().nullable(),
  address: z.string().min(1, "Alamat wajib diisi").max(200),
  kelurahan: z.string().max(100).optional().nullable(),
  kecamatan: z.string().max(100).optional().nullable(),
  kota: z.string().min(2, "Kota wajib diisi").max(100),
  provinsi: z.string().min(2, "Provinsi wajib diisi").max(100),
  // Melebarkan batas koordinat agar tidak error jika terklik area luar saat testing
  lat: z.number().min(-90, "Koordinat Latitude tidak valid").max(90),
  lng: z.number().min(-180, "Koordinat Longitude tidak valid").max(180),
  category: z.enum([
    "lubang",
    "retak",
    "amblas",
    "longsor",
    "bergelombang",
    "lainnya",
  ]),
  imageUrl: z.string().url("Wajib menyertakan URL gambar yang valid"),
});

export const reportQuerySchema = z.object({
  provinsi: z.string().optional(),
  kota: z.string().optional(),
  kecamatan: z.string().optional(),
  urgency: z.enum(["high", "medium", "low"]).optional(),
  status: z.enum(["fail", "verified"]).optional(),
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
  search: z.string().optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
