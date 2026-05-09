"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ImageUpload } from "./ImageUpload";
import { LocationPicker } from "./LocationPicker";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

import { compressImage, getCurrentLocation, reverseGeocode } from "@/lib/utils";
import { DamageCategory } from "@/generated/prisma/enums";

// ── Tipe lokal ────────────────────────────────────────────────────────────────
interface FormData {
  title: string;
  description: string;
  category: DamageCategory | "";
  imageFile: File | null;
  imagePreview: string;
  lat: number;
  lng: number;
  address: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  title: "",
  description: "",
  category: "",
  imageFile: null,
  imagePreview: "",
  lat: -6.2088,
  lng: 106.8456,
  address: "",
  kelurahan: "",
  kecamatan: "",
  kota: "",
  provinsi: "",
};

// ── Komponen ──────────────────────────────────────────────────────────────────
export function AddReportForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadProgress, setUploadProgress] = useState<
    "idle" | "uploading" | "done"
  >("idle");

  // ── Auto-detect GPS ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const pos = await getCurrentLocation();
        const locationData = await reverseGeocode(pos.lat, pos.lng);
        setFormData((prev) => ({
          ...prev,
          lat: pos.lat,
          lng: pos.lng,
          ...locationData,
        }));
      } catch {
        const locationData = await reverseGeocode(-6.2088, 106.8456);
        setFormData((prev) => ({ ...prev, ...locationData }));
      } finally {
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, imageFile: null, imagePreview: "" }));
      return;
    }
    try {
      const compressed = await compressImage(file);
      setFormData((prev) => ({
        ...prev,
        imageFile: compressed,
        imagePreview: URL.createObjectURL(compressed),
      }));
      setErrors((prev) => ({ ...prev, imageFile: undefined }));
    } catch {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleLocationChange = async (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, lat, lng }));
    try {
      const locationData = await reverseGeocode(lat, lng);
      setFormData((prev) => ({ ...prev, ...locationData }));
    } catch {
      // biarkan koordinat tetap terupdate meski geocode gagal
    }
  };

  // ── Validasi ──────────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.title.trim() || formData.title.length < 5)
      errs.title = "Judul laporan minimal 5 karakter";

    if (!formData.description.trim() || formData.description.length < 20)
      errs.description = "Deskripsi minimal 10 karakter";

    if (!formData.imageFile) errs.imageFile = "Foto kerusakan wajib diunggah";

    if (!formData.category) errs.category = "Kategori kerusakan wajib dipilih";

    if (!formData.kota || !formData.provinsi) {
      alert(
        "Mohon tunggu hingga lokasi (kota/provinsi) terdeteksi sebelum mengirim.",
      );
      return false; // Langsung batalkan
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Upload gambar ke /api/upload ──────────────────────────────────────────
  const uploadImage = async (file: File): Promise<string> => {
    setUploadProgress("uploading");

    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    // ⬅️ Sesuaikan tipe kembalian
    const json = (await res.json()) as {
      success: boolean;
      data?: { url: string };
      message?: string;
    };

    if (!res.ok) throw new Error(json.message ?? "Upload gagal");

    setUploadProgress("done");
    return json.data!.url;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning("Mohon lengkapi semua data wajib");
      return;
    }

    setIsSubmitting(true);
    let uploadedUrl = "";

    try {
      // 1. Upload gambar → dapatkan URL tunggal
      uploadedUrl = await uploadImage(formData.imageFile!);

      // 2. Kirim data laporan ke API reports
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          imageUrl: uploadedUrl,
          lat: formData.lat,
          lng: formData.lng,
          address: formData.address,
          kelurahan: formData.kelurahan,
          kecamatan: formData.kecamatan,
          kota: formData.kota,
          provinsi: formData.provinsi,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        // TAMPILKAN DETAIL ERROR DARI ZOD KE CONSOLE
        console.error("Detail Error Validasi Backend:", json.errors);
        throw new Error(json.message ?? "Gagal mengirim laporan");
      }

      toast.success("Laporan berhasil dikirim!");

      router.push(`/dashboard/reports/${json.data!.id}?submitted=true`);
    } catch (err) {
      // ROLLBACK Hapus Gambar jika API Laporan Error
      if (uploadedUrl) {
        try {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: uploadedUrl }),
          });
        } catch (rollbackErr) {
          console.error("Gagal melakukan rollback gambar:", rollbackErr);
        }
      }

      const message =
        err instanceof Error ? err.message : "Gagal mengirim laporan.";
      alert(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress("idle");
    }
  };

  // ── Label progress ────────────────────────────────────────────────────────
  const submitLabel = () => {
    if (uploadProgress === "uploading")
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Mengupload foto…
        </>
      );
    if (isSubmitting)
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Mengirim laporan…
        </>
      );
    return (
      <>
        <Send className="w-4 h-4 mr-2" />
        Kirim Laporan
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Foto ── */}
      <Card>
        <CardContent className="pt-6">
          <ImageUpload
            imagePreview={formData.imagePreview}
            onImageChange={handleImageChange}
            error={errors.imageFile}
          />
        </CardContent>
      </Card>

      {/* ── Info Dasar ── */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <FormInput
            label="Judul Laporan"
            placeholder="Contoh: Jalan Berlubang di Depan SMPN 1"
            value={formData.title}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, title: value }))
            }
            error={errors.title}
            required
          />

          <FormTextarea
            label="Deskripsi"
            placeholder="Jelaskan kondisi kerusakan jalan secara detail..."
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            error={errors.description}
            required
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Kategori Kerusakan"
              value={formData.category}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  category: value as DamageCategory,
                }))
              }
              error={errors.category}
              required
              options={[
                { value: "lubang", label: "Lubang" },
                { value: "retak", label: "Retak" },
                { value: "amblas", label: "Amblas" },
                { value: "longsor", label: "Longsor" },
                { value: "bergelombang", label: "Bergelombang" },
                { value: "lainnya", label: "Lainnya" },
              ]}
              placeholder="Pilih kategori"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Lokasi ── */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Lokasi Kerusakan</h3>
          </div>

          {isLoadingLocation ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Mendeteksi lokasi Anda...</span>
            </div>
          ) : (
            <>
              <LocationPicker
                lat={formData.lat}
                lng={formData.lng}
                onLocationChange={handleLocationChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <FormInput
                  label="Alamat"
                  value={formData.address}
                  onChange={(v) => setFormData((p) => ({ ...p, address: v }))}
                  readOnly
                  placeholder="Otomatis terdeteksi"
                />
                <FormInput
                  label="Kelurahan"
                  value={formData.kelurahan}
                  onChange={(v) => setFormData((p) => ({ ...p, kelurahan: v }))}
                  readOnly
                  placeholder="Otomatis terdeteksi"
                />
                <FormInput
                  label="Kecamatan"
                  value={formData.kecamatan}
                  onChange={(v) => setFormData((p) => ({ ...p, kecamatan: v }))}
                  readOnly
                  placeholder="Otomatis terdeteksi"
                />
                <FormInput
                  label="Kota/Kabupaten"
                  value={formData.kota}
                  onChange={(v) => setFormData((p) => ({ ...p, kota: v }))}
                  readOnly
                  placeholder="Otomatis terdeteksi"
                />
                <FormInput
                  label="Provinsi"
                  value={formData.provinsi}
                  onChange={(v) => setFormData((p) => ({ ...p, provinsi: v }))}
                  readOnly
                  placeholder="Otomatis terdeteksi"
                  className="md:col-span-2"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Tombol ── */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 md:flex-none md:px-8"
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoadingLocation}
          className="flex-1 md:flex-none md:px-8"
        >
          {submitLabel()}
        </Button>
      </div>
    </form>
  );
}
