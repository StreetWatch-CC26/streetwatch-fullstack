import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(100),
  description: z.string().min(10, "Deskripsi minimal 10 karakter").max(1000),
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
  imageUrl: z.string().url("Wajib menyertakan URL gambar yang valid"),
});

export const reportQuerySchema = z.object({
  provinsi: z.string().optional(),
  kota: z.string().optional(),
  kecamatan: z.string().optional(),
  urgency: z.enum(["high", "medium", "low"]).optional(),
  // Sesuaikan status
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
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
