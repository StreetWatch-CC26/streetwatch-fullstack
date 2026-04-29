"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { LocationPicker } from "./LocationPicker";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormSelect } from "./FormSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Send } from "lucide-react";
import { compressImage, getCurrentLocation, reverseGeocode } from "@/lib/utils";
import type { DamageCategory, Urgency } from "@/data/mock-reports";

interface FormData {
  title: string;
  description: string;
  category: DamageCategory | "";
  urgency: Urgency | "";
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

const initialFormData: FormData = {
  title: "",
  description: "",
  category: "",
  urgency: "",
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
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  // Auto-detect GPS location on mount
  useEffect(() => {
    const initLocation = async () => {
      try {
        const position = await getCurrentLocation();
        const locationData = await reverseGeocode(position.lat, position.lng);

        setFormData((prev) => ({
          ...prev,
          lat: position.lat,
          lng: position.lng,
          ...locationData,
        }));
      } catch (error) {
        console.error("Failed to get location:", error);
        // Fallback to Jakarta center
        const locationData = await reverseGeocode(-6.2088, 106.8456);
        setFormData((prev) => ({
          ...prev,
          ...locationData,
        }));
      } finally {
        setIsLoadingLocation(false);
      }
    };

    initLocation();
  }, []);

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, imageFile: null, imagePreview: "" }));
      return;
    }

    try {
      const compressed = await compressImage(file);
      const preview = URL.createObjectURL(compressed);
      setFormData((prev) => ({
        ...prev,
        imageFile: compressed,
        imagePreview: preview,
      }));
      setErrors((prev) => ({ ...prev, imageFile: undefined }));
    } catch (error) {
      console.error("Image compression failed:", error);
      // Fallback to original file
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: preview,
      }));
    }
  };

  const handleLocationChange = async (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, lat, lng }));

    try {
      const locationData = await reverseGeocode(lat, lng);
      setFormData((prev) => ({ ...prev, ...locationData }));
    } catch (error) {
      console.error("Reverse geocode failed:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Judul laporan wajib diisi";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    }

    if (!formData.imageFile) {
      newErrors.imageFile = "Foto kerusakan wajib diunggah";
    }

    if (!formData.category) {
      newErrors.category = "Kategori kerusakan wajib dipilih";
    }

    if (!formData.urgency) {
      newErrors.urgency = "Tingkat urgensi wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock uploaded image URL
      const mockImageUrl = formData.imagePreview;

      const reportData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        imageUrl: mockImageUrl,
        lat: formData.lat,
        lng: formData.lng,
        address: formData.address,
        kelurahan: formData.kelurahan,
        kecamatan: formData.kecamatan,
        kota: formData.kota,
        provinsi: formData.provinsi,
      };

      //   console.log("Report submitted:", reportData);

      // Redirect to success page or report list
      router.push("/reports?success=true");
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("Gagal mengirim laporan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload Section */}
      <Card>
        <CardContent className="pt-6">
          <ImageUpload
            imagePreview={formData.imagePreview}
            onImageChange={handleImageChange}
            error={errors.imageFile}
          />
        </CardContent>
      </Card>

      {/* Basic Info Section */}
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
                { value: "lainnya", label: "Lainnya" },
              ]}
              placeholder="Pilih kategori"
            />

            <FormSelect
              label="Tingkat Urgensi"
              value={formData.urgency}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, urgency: value as Urgency }))
              }
              error={errors.urgency}
              required
              options={[
                { value: "high", label: "🔴 Tinggi" },
                { value: "medium", label: "🟡 Sedang" },
                { value: "low", label: "🟢 Rendah" },
              ]}
              placeholder="Pilih urgensi"
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Section */}
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
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, address: value }))
                  }
                  readOnly
                  placeholder="Alamat otomatis terdeteksi"
                />

                <FormInput
                  label="Kelurahan"
                  value={formData.kelurahan}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, kelurahan: value }))
                  }
                  readOnly
                  placeholder="Kelurahan otomatis terdeteksi"
                />

                <FormInput
                  label="Kecamatan"
                  value={formData.kecamatan}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, kecamatan: value }))
                  }
                  readOnly
                  placeholder="Kecamatan otomatis terdeteksi"
                />

                <FormInput
                  label="Kota/Kabupaten"
                  value={formData.kota}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, kota: value }))
                  }
                  readOnly
                  placeholder="Kota otomatis terdeteksi"
                />

                <FormInput
                  label="Provinsi"
                  value={formData.provinsi}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, provinsi: value }))
                  }
                  readOnly
                  placeholder="Provinsi otomatis terdeteksi"
                  className="md:col-span-2"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
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
              Mengirim...
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
  );
}
