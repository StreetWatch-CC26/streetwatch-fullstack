"use client";

import { useRef, useState } from "react";
import { Camera, Upload, X, Image as ImageIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  imagePreview: string;
  onImageChange: (file: File | null) => void;
  error?: string;
}

export function ImageUpload({
  imagePreview,
  onImageChange,
  error,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    onImageChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Foto Kerusakan <span className="text-destructive">*</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        // Enable camera on mobile devices
        capture="environment"
      />

      {imagePreview ? (
        // Image Preview
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={openFileDialog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/90 border border-border text-xs font-medium text-foreground hover:bg-background transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Ganti Foto
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/90 border border-border text-xs font-medium text-destructive hover:bg-background transition-colors disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
          {/* Filename chip */}
          {/* {fileName && (
                 <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-[10px] text-muted-foreground font-mono border border-border/60">
                   {fileName}
                 </div>
               )} */}
        </div>
      ) : (
        // Upload Area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative aspect-video w-full min-h-55 border-2 border-dashed rounded-lg transition-all cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-accent/50",
            error && "border-destructive",
          )}
          onClick={openFileDialog}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unggah Foto Kerusakan
            </h3>

            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Drag & drop foto di sini, atau klik untuk memilih file
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {/* Desktop: Upload button */}
              <button
                type="button"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                <Upload className="w-4 h-4" />
                Pilih File
              </button>

              {/* Mobile: Camera & Gallery buttons */}
              <button
                type="button"
                className="md:hidden inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                <Camera className="w-4 h-4" />
                Ambil Foto
              </button>

              <button
                type="button"
                className="md:hidden inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Create a new input without capture attribute for gallery
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                      handleFileSelect(files[0]);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="w-4 h-4" />
                Pilih dari Galeri
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Format: JPG, PNG, WEBP • Maksimal 10MB
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        💡 Foto akan dikompres otomatis tanpa mengurangi kualitas untuk analisis
        ML
      </p>
    </div>
  );
}
