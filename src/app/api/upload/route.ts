import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  deleteImageFromSupabase,
  uploadImageToSupabase,
} from "@/services/storage.service";
import {
  badRequest,
  created,
  unauthorized,
  serverError,
  ok,
} from "@/lib/api-response";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const formData = await req.formData();
    const files = formData.getAll("image") as File[];

    if (!files.length) return badRequest("Tidak ada gambar yang dikirim");
    if (files.length > 1) return badRequest("Maksimal 1 gambar per laporan");

    const file = files[0]; // Ambil file pertama saja

    if (!ALLOWED_TYPES.includes(file.type))
      return badRequest(`Tipe file tidak didukung: ${file.type}`);
    if (file.size > MAX_SIZE_BYTES)
      return badRequest(`Ukuran file terlalu besar: ${file.name}`);

    // Upload hanya 1 file
    const url = await uploadImageToSupabase(file, "reports");

    // ⬅️ Kembalikan single url
    return created({ url });
  } catch (err) {
    console.error("[upload]", err);
    return serverError("Upload gambar gagal");
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const { url } = await req.json();
    if (!url) return badRequest("URL gambar tidak diberikan");

    // Hapus gambar dari supabase
    await deleteImageFromSupabase(url);

    return ok({ message: "Gambar berhasil dihapus" });
  } catch (err) {
    console.error("[delete_upload]", err);
    return serverError("Gagal menghapus gambar");
  }
}
