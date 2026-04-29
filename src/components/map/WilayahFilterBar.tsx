"use client";

/**
 * components/dashboard/WilayahFilterBar.tsx
 *
 * Filter 2 level: Provinsi → Kabupaten/Kota.
 * Menggunakan state dari useWilayahFilter hook.
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X, Search, Loader2, MapPin } from "lucide-react";
import type { WilayahFilterState, WilayahItem } from "@/hooks/useWilayahFilter";
import { cn } from "@/lib/utils";

// ─── Reusable Dropdown ────────────────────────────────────────────────────────

interface DropdownProps {
  placeholder: string;
  value: WilayahItem | null;
  options: WilayahItem[];
  onSelect: (item: WilayahItem | null) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
}

function Dropdown({
  placeholder,
  value,
  options,
  onSelect,
  disabled,
  loading,
  error,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const filtered = useMemo(
    () =>
      query
        ? options.filter((o) =>
            o.nama.toLowerCase().includes(query.toLowerCase()),
          )
        : options,
    [options, query],
  );

  const isDisabled = disabled || loading;

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* Trigger button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) {
            setOpen((o) => !o);
            setQuery("");
          }
        }}
        className={cn(
          "w-full h-8 flex items-center gap-1.5 px-2.5 rounded-lg border text-xs font-medium transition-all duration-150",
          "bg-background",
          isDisabled
            ? "border-border/40 text-muted-foreground/50 cursor-not-allowed"
            : open
              ? "border-primary ring-2 ring-primary/20 text-foreground"
              : "border-border hover:border-primary/50 text-foreground",
        )}
      >
        {/* Label */}
        <span className="truncate flex-1 text-left">
          {loading ? (
            <span className="text-muted-foreground">Memuat…</span>
          ) : value ? (
            <span className="font-semibold">{value.nama}</span>
          ) : (
            <span className="text-muted-foreground font-normal">
              {placeholder}
            </span>
          )}
        </span>

        {/* Right icons */}
        <span className="flex items-center gap-0.5 flex-shrink-0">
          {loading && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
          {value && !loading && (
            <span
              role="button"
              tabIndex={0}
              className="rounded hover:bg-muted p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && onSelect(null)}
            >
              <X className="w-2.5 h-2.5 text-muted-foreground" />
            </span>
          )}
          {!loading && (
            <ChevronDown
              className={cn(
                "w-3 h-3 text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          )}
        </span>
      </button>

      {/* Error hint */}
      {error && !open && (
        <p className="absolute top-full left-0 mt-1 text-[10px] text-destructive z-50">
          Gagal memuat data
        </p>
      )}

      {/* Dropdown panel */}
      {open && !isDisabled && (
        <div className="absolute top-full left-0 mt-1 z-[500] w-full min-w-[220px] bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <label className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-lg">
              <Search className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Cari ${placeholder.toLowerCase()}…`}
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </label>
          </div>

          {/* Option list */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-muted-foreground text-center">
                Tidak ditemukan
              </p>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between gap-2",
                    value?.id === item.id
                      ? "text-primary font-semibold bg-primary/8"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="truncate">{item.nama}</span>
                  {value?.id === item.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Count footer */}
          {filtered.length > 0 && (
            <div className="px-3 py-1.5 border-t border-border text-[10px] text-muted-foreground">
              {filtered.length} wilayah
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── WilayahFilterBar ─────────────────────────────────────────────────────────

interface Props {
  filter: WilayahFilterState;
}

export function WilayahFilterBar({ filter }: Props) {
  const {
    provinsiList,
    kabupatenList,
    selectedProvinsi,
    selectedKabupaten,
    loadingProvinsi,
    loadingKabupaten,
    errorProvinsi,
    errorKabupaten,
    selectProvinsi,
    selectKabupaten,
    reset,
  } = filter;

  const hasFilter = !!(selectedProvinsi || selectedKabupaten);

  return (
    <div className="flex items-center gap-1.5 w-full min-w-0">
      {/* Icon */}
      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />

      {/* Provinsi */}
      <Dropdown
        placeholder="Provinsi"
        value={selectedProvinsi}
        options={provinsiList}
        onSelect={selectProvinsi}
        loading={loadingProvinsi}
        error={errorProvinsi}
      />

      {/* Kabupaten/Kota */}
      <Dropdown
        placeholder="Kab / Kota"
        value={selectedKabupaten}
        options={kabupatenList}
        onSelect={selectKabupaten}
        disabled={!selectedProvinsi}
        loading={loadingKabupaten}
        error={errorKabupaten}
      />

      {/* Reset */}
      {hasFilter && (
        <button
          onClick={reset}
          title="Reset filter"
          className={cn(
            "h-8 flex items-center gap-1 px-2 rounded-lg text-xs flex-shrink-0 transition-colors",
            "text-muted-foreground border border-transparent",
            "hover:text-destructive hover:bg-destructive/8 hover:border-destructive/20",
          )}
        >
          <X className="w-3 h-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}
    </div>
  );
}
