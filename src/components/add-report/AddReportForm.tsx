"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { ImageUpload } from "./ImageUpload";
import { LocationPicker } from "./LocationPicker";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { SubmitLoadingOverlay, type SubmitStep } from "./SubmitLoadingOverlay";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  MapPin,
  Send,
  ImageOff,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import {
  base64ToFile,
  compressImage,
  getCurrentLocation,
  reverseGeocode,
} from "@/lib/utils";
import { DamageCategory } from "@/generated/prisma/enums";
import { useAnalysisStore } from "@/stores/analysis.store";

interface FormData {
  title: string;
  description: string | null;
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

export function AddReportForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(INITIAL);
  const [submitStep, setSubmitStep] = useState<SubmitStep>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const hasProcessedStore = useRef(false);

  const {
    result,
    imagePreview: storePreview,
    imageName,
    clear: clearStore,
  } = useAnalysisStore();

  const abortControllerRef = useRef<AbortController | null>(null);
  const uploadedUrlRef = useRef<string>("");

  const isSubmitting = submitStep !== null;

  useEffect(() => {
    if (!storePreview || !result) return;
    if (hasProcessedStore.current) return;
    hasProcessedStore.current = true;

    const timer = setTimeout(() => {
      try {
        const file = base64ToFile(
          storePreview,
          imageName || "playground-image.jpg",
        );
        const defaultCategory: DamageCategory | "" = result.isDamageDetected
          ? "lubang"
          : "";
        let aiDescription = "";

        if (result.isDamageDetected && result.recommendations?.length) {
          aiDescription = `Catatan AI: Terdeteksi ${result.totalPotholes} titik kerusakan (Tingkat: ${result.rawSeverity}).\n\nRekomendasi Penanganan:\n${result.recommendations.map((r) => "- " + r).join("\n")}`;
        }

        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: storePreview,
          category: defaultCategory,
          description: aiDescription,
        }));
        toast.success("Gambar dan hasil dari Playground berhasil dimuat!");
      } catch (err) {
        console.error("Gagal mengurai gambar dari session store", err);
      } finally {
        clearStore();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [storePreview, result, imageName, clearStore]);

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

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

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
    } catch {}
  };

  const handleCancel = async () => {
    abortControllerRef.current?.abort();
    const uploadedUrl = uploadedUrlRef.current;
    if (uploadedUrl) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: uploadedUrl }),
        });
        uploadedUrlRef.current = "";
      } catch (err) {
        console.error("Gagal rollback gambar:", err);
      }
    }
    setSubmitStep(null);
    toast.info("Pengiriman laporan dibatalkan.");
  };

  const validateForm = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.title.trim() || formData.title.length < 5)
      errs.title = "Judul laporan minimal 5 karakter";
    if (formData.description && formData.description.length > 1000)
      errs.description = "Deskripsi tidak boleh lebih dari 1000 karakter";
    if (!formData.imageFile) errs.imageFile = "Foto kerusakan wajib diunggah";
    if (!formData.category) errs.category = "Kategori kerusakan wajib dipilih";

    if (!formData.kota || !formData.provinsi) {
      errs.address = "Lokasi belum terdeteksi sempurna";
      toast.warning(
        "Mohon tunggu hingga lokasi terdeteksi, atau pindahkan pin pada peta.",
      );
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Auto scroll ke error pertama
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return Object.keys(errs).length === 0;
  };

  const uploadImage = async (
    file: File,
    signal: AbortSignal,
  ): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
      signal,
    });
    const json = (await res.json()) as {
      success: boolean;
      data?: { url: string };
      message?: string;
    };
    if (!res.ok) throw new Error(json.message ?? "Upload gagal");
    return json.data!.url;
  };

  const rollbackImage = async (url: string) => {
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      uploadedUrlRef.current = "";
    } catch (err) {
      console.error("Gagal rollback gambar:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const { signal } = controller;

    try {
      setSubmitStep("uploading");
      const uploadedUrl = await uploadImage(formData.imageFile!, signal);
      uploadedUrlRef.current = uploadedUrl;

      if (signal.aborted) return;

      setSubmitStep("analyzing");
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
        signal,
      });

      if (signal.aborted) return;
      setSubmitStep("saving");
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 422) {
          toast.error(json.message ?? "Foto bukan foto jalan.", {
            description: "Silakan gunakan foto jalan yang rusak.",
            duration: 6000,
            icon: <ImageOff className="w-4 h-4" />,
          });
          await rollbackImage(uploadedUrl);
          return;
        }
        if (json.errors) {
          const firstErrorField = Object.keys(json.errors)[0];
          throw new Error(
            `Data tidak valid (${firstErrorField}): ${json.errors[firstErrorField][0]}`,
          );
        }
        throw new Error(json.message ?? "Gagal mengirim laporan");
      }

      uploadedUrlRef.current = "";
      toast.success("Laporan berhasil dikirim!");
      router.push(`/dashboard/reports/${json.data!.id}?submitted=true`);
    } catch (err) {
      if (signal.aborted) return;
      toast.error(
        err instanceof Error ? err.message : "Gagal mengirim laporan.",
      );
      if (uploadedUrlRef.current) await rollbackImage(uploadedUrlRef.current);
    } finally {
      if (!signal.aborted) {
        setSubmitStep(null);
        abortControllerRef.current = null;
      }
    }
  };

  return (
    <>
      {isSubmitting && submitStep && (
        <SubmitLoadingOverlay
          step={submitStep}
          onCancel={submitStep !== "saving" ? handleCancel : undefined}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pb-24 md:pb-8">
        {Object.keys(errors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Mohon perbaiki isian berikut:</p>
              <ul className="list-disc pl-4 mt-1 opacity-90">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Card className="border-border shadow-sm">
          <CardContent className="p-4 md:p-6">
            <ImageUpload
              imagePreview={formData.imagePreview}
              onImageChange={handleImageChange}
              error={errors.imageFile}
            />
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Detail Laporan</CardTitle>
            </div>
            <CardDescription>
              Ceritakan detail kerusakan jalan yang kamu temukan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
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
                { value: "lubang", label: "Lubang (Pothole)" },
                { value: "retak", label: "Retak (Cracks)" },
                { value: "amblas", label: "Amblas (Subsidence)" },
                { value: "longsor", label: "Longsor (Landslide)" },
                { value: "bergelombang", label: "Permukaan Bergelombang" },
                { value: "lainnya", label: "Lainnya" },
              ]}
              placeholder="Pilih kategori yang paling sesuai"
            />

            <FormTextarea
              label="Deskripsi Tambahan"
              placeholder="Jelaskan kondisi kerusakan jalan secara detail (opsional)..."
              value={formData.description || ""}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              error={errors.description}
              rows={4}
            />
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Lokasi Kerusakan</CardTitle>
            </div>
            <CardDescription>
              Ambil lokasi saat ini atau posisikan pin tepat pada titik
              kerusakan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {isLoadingLocation ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
                <span className="font-medium">Mencari lokasi Anda...</span>
              </div>
            ) : (
              <>
                <LocationPicker
                  lat={formData.lat}
                  lng={formData.lng}
                  onLocationChange={handleLocationChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <FormInput
                    label="Alamat Lengkap"
                    value={formData.address}
                    onChange={(v) => setFormData((p) => ({ ...p, address: v }))}
                    readOnly
                    placeholder="Alamat akan terisi otomatis"
                    className="md:col-span-2 opacity-80"
                  />
                  <FormInput
                    label="Kelurahan / Desa"
                    value={formData.kelurahan}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, kelurahan: v }))
                    }
                    readOnly
                    placeholder="Terisi otomatis"
                    className="opacity-80"
                  />
                  <FormInput
                    label="Kecamatan"
                    value={formData.kecamatan}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, kecamatan: v }))
                    }
                    readOnly
                    placeholder="Terisi otomatis"
                    className="opacity-80"
                  />
                  <FormInput
                    label="Kota/Kabupaten"
                    value={formData.kota}
                    onChange={(v) => setFormData((p) => ({ ...p, kota: v }))}
                    readOnly
                    placeholder="Terisi otomatis"
                    className="opacity-80"
                  />
                  <FormInput
                    label="Provinsi"
                    value={formData.provinsi}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, provinsi: v }))
                    }
                    readOnly
                    placeholder="Terisi otomatis"
                    className="opacity-80"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── Sticky Action Buttons (UI/UX Improvement) ── */}
        <div className="mt-5 flex gap-3 ">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 md:flex-none md:w-32 rounded-xl"
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoadingLocation}
            className="flex-2 md:flex-none md:w-48 rounded-xl shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses…
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kirim Laporan
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
