"use client";

/**
 * components/playground/ImageDropzone.tsx
 *
 * Drag & drop / click-to-upload zone.
 * Menampilkan preview gambar setelah upload.
 */

import { useRef, useState, useCallback } from "react";
import { Upload, ImagePlus, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  preview: string | null;
  fileName: string | null;
  disabled?: boolean;
  onFile: (f: File) => void;
  onReset: () => void;
}

export function ImageDropzone({
  preview,
  fileName,
  disabled,
  onFile,
  onReset,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      onFile(files[0]);
    },
    [onFile],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  /* ── With preview ── */
  if (preview) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-muted/20 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Preview kerusakan jalan"
          className="w-full h-full object-cover"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/90 border border-border text-xs font-medium text-foreground hover:bg-background transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Ganti Foto
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/90 border border-border text-xs font-medium text-destructive hover:bg-background transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
        {/* Filename chip */}
        {fileName && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-[10px] text-muted-foreground font-mono border border-border/60">
            {fileName}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  /* ── Empty state ── */
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4",
        "w-full min-h-55 rounded-2xl border-2 border-dashed",
        "cursor-pointer select-none transition-all duration-200",
        dragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {/* Dot-grid background texture */}
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors",
          dragging
            ? "bg-primary/10 border-primary/40"
            : "bg-muted/60 border-border",
        )}
      >
        {dragging ? (
          <Upload className="w-6 h-6 text-primary" />
        ) : (
          <ImagePlus className="w-6 h-6 text-muted-foreground" />
        )}
      </div>

      <div className="text-center px-4">
        <p className="text-sm font-semibold text-foreground mb-1">
          {dragging ? "Lepas untuk upload" : "Upload Foto Jalan"}
        </p>
        <p className="text-xs text-muted-foreground">
          Drag & drop atau klik · JPG, PNG, WEBP · Maks. 10 MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
