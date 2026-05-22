"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { ImageUpload } from "./ImageUpload";
import { LocationPicker } from "./LocationPicker";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  MapPin,
  Send,
  X,
  ImageOff,
  BrainCircuit,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { compressImage, getCurrentLocation, reverseGeocode } from "@/lib/utils";
import { DamageCategory } from "@/generated/prisma/enums";
import { useAnalysisStore } from "@/stores/analysis.store";

// ── Tipe lokal ────────────────────────────────────────────────────────────────

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
type SubmitStep = "uploading" | "analyzing" | "saving" | null;

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

const STEP_CONFIG: Record<
  Exclude<SubmitStep, null>,
  {
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    cancelable: boolean;
  }
> = {
  uploading: {
    label: "Mengupload foto…",
    sublabel: "Mengunggah gambar ke server",
    icon: <Upload className="w-5 h-5" />,
    cancelable: true,
  },
  analyzing: {
    label: "Menganalisis kerusakan…",
    sublabel: "AI sedang memvalidasi foto jalan",
    icon: <BrainCircuit className="w-5 h-5" />,
    cancelable: true,
  },
  saving: {
    label: "Menyimpan laporan…",
    sublabel: "Hampir selesai",
    icon: <CheckCircle2 className="w-5 h-5" />,
    cancelable: false,
  },
};

// ── Helper: Konversi Base64 ke File ───────────────────────────────────────────
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// ── Komponen ──────────────────────────────────────────────────────────────────

export function AddReportForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(INITIAL);
  const [submitStep, setSubmitStep] = useState<SubmitStep>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  // State indikator agar integrasi state global hanya berjalan 1x
  const hasProcessedStore = useRef(false);

  // Akses global state dari Zustand
  const {
    result,
    imagePreview: storePreview,
    imageName,
    clear: clearStore,
  } = useAnalysisStore();

  const abortControllerRef = useRef<AbortController | null>(null);
  const uploadedUrlRef = useRef<string>("");

  const isSubmitting = submitStep !== null;

  // ── Inject Data dari Global Store (Playground) ───────────────────────────
  useEffect(() => {
    // 1. Jika data belum tersedia (proses hidrasi Zustand), hentikan eksekusi
    if (!storePreview || !result) return;

    // 2. Cegah agar proses ini hanya berjalan 1x, tidak berulang-ulang
    if (hasProcessedStore.current) return;
    hasProcessedStore.current = true;

    // 3. Gunakan setTimeout agar setState berjalan secara asynchronous.
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
        // Bersihkan store
        clearStore();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [storePreview, result, imageName, clearStore]);

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

  // ── Cleanup AbortController saat unmount ─────────────────────────────────
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
      toast.warning("Mohon tunggu hingga lokasi terdeteksi sebelum mengirim.");
      return false;
    }

    setErrors(errs);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning("Mohon lengkapi semua data wajib");
      return;
    }

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
          console.error("Detail Error Validasi Backend:", json.errors);

          // Ambil nama kolom pertama yang error beserta pesannya
          const firstErrorField = Object.keys(json.errors)[0];
          const firstErrorMessage = json.errors[firstErrorField][0];

          throw new Error(
            `Data tidak valid (${firstErrorField}): ${firstErrorMessage}`,
          );
        }

        throw new Error(json.message ?? "Gagal mengirim laporan");
      }

      uploadedUrlRef.current = "";
      toast.success("Laporan berhasil dikirim!");
      router.push(`/dashboard/reports/${json.data!.id}?submitted=true`);
    } catch (err) {
      if (signal.aborted) return;

      const message =
        err instanceof Error ? err.message : "Gagal mengirim laporan.";
      toast.error(message);

      if (uploadedUrlRef.current) {
        await rollbackImage(uploadedUrlRef.current);
      }
    } finally {
      if (!signal.aborted) {
        setSubmitStep(null);
        abortControllerRef.current = null;
      }
    }
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

  return (
    <>
      {/* ── Loading Overlay ── */}
      {isSubmitting && submitStep && (
        <SubmitLoadingOverlay
          step={submitStep}
          onCancel={
            STEP_CONFIG[submitStep].cancelable ? handleCancel : undefined
          }
        />
      )}

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
              value={formData.description || ""}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              error={errors.description}
              required={false}
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
              <h3 className="font-semibold text-foreground">
                Lokasi Kerusakan
              </h3>
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
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, kelurahan: v }))
                    }
                    readOnly
                    placeholder="Otomatis terdeteksi"
                  />
                  <FormInput
                    label="Kecamatan"
                    value={formData.kecamatan}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, kecamatan: v }))
                    }
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
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, provinsi: v }))
                    }
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

// ── Loading Overlay Component ─────────────────────────────────────────────────
interface SubmitLoadingOverlayProps {
  step: Exclude<SubmitStep, null>;
  onCancel?: () => void;
}

function SubmitLoadingOverlay({ step, onCancel }: SubmitLoadingOverlayProps) {
  const config = STEP_CONFIG[step];
  const steps = ["uploading", "analyzing", "saving"] as const;
  const currentIndex = steps.indexOf(step);

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-background border border-border rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
        {/* Animated icon */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse ring */}
          <span className="absolute w-16 h-16 rounded-full bg-primary/15 animate-ping" />
          {/* Inner circle */}
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 text-primary">
            {config.icon}
          </span>
        </div>

        {/* Label */}
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {config.label}
          </p>
          <p className="text-xs text-muted-foreground">{config.sublabel}</p>
        </div>

        {/* Step progress dots */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={[
                "rounded-full transition-all duration-300",
                i < currentIndex
                  ? "w-2 h-2 bg-primary"
                  : i === currentIndex
                    ? "w-3 h-3 bg-primary animate-pulse"
                    : "w-2 h-2 bg-muted-foreground/30",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Cancel button */}
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/8 h-8 px-3"
          >
            <X className="w-3.5 h-3.5" />
            Batalkan
          </Button>
        )}
      </div>
    </div>
  );
}
