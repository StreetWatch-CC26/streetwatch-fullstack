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
  // URL format: https://[project].supabase.co/storage/v1/object/public/report-images/reports/xxx.jpg
  const path = publicUrl.split(
    `/storage/v1/object/public/${STORAGE_BUCKET}/`,
  )[1];
  if (!path) return;

  await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path]);
}
