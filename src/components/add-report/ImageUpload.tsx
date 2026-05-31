"use client";

import { useRef, useState } from "react";
import { Camera, Upload, X, Image as ImageIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiLightbulbFill } from "@remixicon/react";

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
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }
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
    if (files.length > 0) handleFileSelect(files[0]);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
  };
  const handleRemove = () => {
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const openFileDialog = () => fileInputRef.current?.click();
  const openGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) handleFileSelect(files[0]);
    };
    input.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-foreground">
        Foto Kerusakan <span className="text-destructive">*</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      {imagePreview ? (
        <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="Preview foto kerusakan"
            className="w-full h-auto max-h-[70vh] object-contain"
          />

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={openFileDialog}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-background/95 border border-border text-xs font-semibold text-foreground hover:bg-background transition-colors shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Ganti Foto
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-background/95 border border-destructive/30 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-colors shadow-lg"
            >
              <X className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>

          {/* Mobile: always-visible bottom bar (no hover state on touch) */}
          <div className="sm:hidden absolute bottom-0 left-0 right-0 flex gap-2 p-2 bg-linear-to-t from-black/70 to-transparent">
            <button
              type="button"
              onClick={openFileDialog}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-background/90 text-xs font-semibold text-foreground"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-destructive/90 text-xs font-semibold text-destructive-foreground"
            >
              <X className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        /* ── Upload dropzone ── */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={cn(
            "relative w-full border-2 border-dashed rounded-xl transition-all cursor-pointer",
            "py-10 px-6",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-accent/30",
            error && "border-destructive bg-destructive/5",
          )}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                isDragging ? "bg-primary/20" : "bg-muted",
              )}
            >
              <ImageIcon
                className={cn(
                  "w-7 h-7",
                  isDragging ? "text-primary" : "text-muted-foreground",
                )}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                {isDragging ? "Lepaskan foto di sini" : "Unggah Foto Kerusakan"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag & drop, atau klik untuk memilih
              </p>
            </div>

            {/* Desktop button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Pilih File
            </button>

            {/* Mobile: two buttons — camera and gallery */}
            <div className="flex gap-2 md:hidden w-full max-w-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Kamera
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openGallery();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-secondary text-secondary-foreground border border-border rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Galeri
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              JPG, PNG, WEBP · Maksimal 10MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <RiLightbulbFill className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        Foto akan dikompres otomatis sebelum dikirim
      </p>
    </div>
  );
}
