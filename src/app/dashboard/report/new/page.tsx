import { AddReportForm } from "@/components/report/AddReportForm";

export default function AddReportPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Laporkan Kerusakan Jalan
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Bantu kami memperbaiki infrastruktur dengan melaporkan kerusakan jalan
          di sekitar Anda
        </p>
      </div>

      <AddReportForm />
    </div>
  );
}

//================================================================
// "use client";

// import { useState, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   MapPin,
//   Camera,
//   X,
//   Loader2,
//   CheckCircle2,
//   Navigation,
//   Image as ImageIcon,
//   AlertTriangle,
//   ChevronLeft,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import {
//   CATEGORY_LABEL,
//   type DamageCategory,
//   type Urgency,
//   URGENCY_LABEL,
// } from "@/data/dashboard-data";

// type FormStep = "location" | "details" | "review";

// interface FormData {
//   address: string;
//   district: string;
//   city: string;
//   lat: number | null;
//   lng: number | null;
//   title: string;
//   description: string;
//   category: DamageCategory | "";
//   urgency: Urgency | "";
//   images: { url: string; file: File }[];
// }

// const STEPS: { key: FormStep; label: string }[] = [
//   { key: "location", label: "Lokasi" },
//   { key: "details", label: "Detail" },
//   { key: "review", label: "Tinjau" },
// ];

// export default function NewReportPage() {
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [step, setStep] = useState<FormStep>("location");
//   const [locating, setLocating] = useState(false);
//   const [locError, setLocError] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const [form, setForm] = useState<FormData>({
//     address: "",
//     district: "",
//     city: "",
//     lat: null,
//     lng: null,
//     title: "",
//     description: "",
//     category: "",
//     urgency: "",
//     images: [],
//   });

//   // ── Geolocation ──────────────────────────────────────────────────────────────
//   const detectLocation = useCallback(() => {
//     if (!navigator.geolocation) {
//       setLocError("Browser tidak mendukung geolokasi.");
//       return;
//     }
//     setLocating(true);
//     setLocError("");
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude: lat, longitude: lng } = pos.coords;
//         try {
//           // Reverse geocode via Nominatim (free, no key needed)
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
//             { headers: { "Accept-Language": "id" } },
//           );
//           const data = await res.json();
//           const addr = data.address ?? {};
//           setForm((f) => ({
//             ...f,
//             lat,
//             lng,
//             address:
//               [addr.road, addr.house_number].filter(Boolean).join(" ") ||
//               data.display_name?.split(",")[0] ||
//               "",
//             district:
//               addr.suburb ||
//               addr.village ||
//               addr.county ||
//               addr.city_district ||
//               "",
//             city: addr.city || addr.town || addr.municipality || "Pekanbaru",
//           }));
//         } catch {
//           setForm((f) => ({
//             ...f,
//             lat,
//             lng,
//             address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
//           }));
//         }
//         setLocating(false);
//       },
//       (err) => {
//         setLocError(
//           "Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.",
//         );
//         setLocating(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000 },
//     );
//   }, []);

//   // ── Image Upload ─────────────────────────────────────────────────────────────
//   const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []);
//     const newImages = files
//       .slice(0, 4 - form.images.length)
//       .map((file) => ({ url: URL.createObjectURL(file), file }));
//     setForm((f) => ({ ...f, images: [...f.images, ...newImages] }));
//     e.target.value = "";
//   };

//   const removeImage = (idx: number) => {
//     setForm((f) => {
//       URL.revokeObjectURL(f.images[idx].url);
//       return { ...f, images: f.images.filter((_, i) => i !== idx) };
//     });
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────────
//   const handleSubmit = async () => {
//     setSubmitting(true);
//     await new Promise((r) => setTimeout(r, 1500)); // simulate API
//     setSubmitting(false);
//     setSubmitted(true);
//   };

//   const canProceedLocation = form.address.trim() !== "" && form.lat !== null;
//   const canProceedDetails =
//     form.title.trim() !== "" &&
//     form.description.trim() !== "" &&
//     form.category !== "" &&
//     form.images.length > 0;

//   // ── Success state ─────────────────────────────────────────────────────────────
//   if (submitted) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-5">
//         <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
//           <CheckCircle2 className="w-10 h-10 text-primary" />
//         </div>
//         <div>
//           <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
//             Laporan Terkirim!
//           </h2>
//           <p className="text-sm text-muted-foreground max-w-xs">
//             Laporan kamu sedang diproses. Kamu akan mendapat notifikasi saat
//             status berubah.
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             onClick={() => router.push("/dashboard/map")}
//           >
//             Lihat Peta
//           </Button>
//           <Button
//             onClick={() => {
//               setSubmitted(false);
//               setStep("location");
//               setForm({
//                 address: "",
//                 district: "",
//                 city: "",
//                 lat: null,
//                 lng: null,
//                 title: "",
//                 description: "",
//                 category: "",
//                 urgency: "",
//                 images: [],
//               });
//             }}
//           >
//             Lapor Lagi
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <button
//           onClick={() =>
//             step !== "location"
//               ? setStep(step === "review" ? "details" : "location")
//               : router.back()
//           }
//           className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
//         >
//           <ChevronLeft className="w-5 h-5" />
//         </button>
//         <div>
//           <h1 className="font-heading text-xl font-bold text-foreground">
//             Tambah Laporan
//           </h1>
//           <p className="text-xs text-muted-foreground">
//             Laporkan kerusakan jalan di sekitarmu
//           </p>
//         </div>
//       </div>

//       {/* Step indicator */}
//       <div className="flex items-center gap-0 mb-8">
//         {STEPS.map((s, i) => {
//           const idx = STEPS.findIndex((x) => x.key === step);
//           const done = i < idx;
//           const active = s.key === step;
//           return (
//             <div
//               key={s.key}
//               className="flex items-center flex-1 last:flex-none"
//             >
//               <div className="flex flex-col items-center gap-1">
//                 <div
//                   className={cn(
//                     "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
//                     done
//                       ? "bg-primary text-primary-foreground"
//                       : active
//                         ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
//                         : "bg-muted text-muted-foreground",
//                   )}
//                 >
//                   {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
//                 </div>
//                 <span
//                   className={cn(
//                     "text-[10px] font-medium",
//                     active ? "text-primary" : "text-muted-foreground",
//                   )}
//                 >
//                   {s.label}
//                 </span>
//               </div>
//               {i < STEPS.length - 1 && (
//                 <div
//                   className={cn(
//                     "flex-1 h-px mx-2 mb-4",
//                     done ? "bg-primary" : "bg-border",
//                   )}
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* ── Step 1: Location ── */}
//       {step === "location" && (
//         <div className="space-y-5">
//           <div className="rounded-2xl border border-border bg-card p-5">
//             <h2 className="font-heading font-bold text-foreground mb-1">
//               Lokasi Kerusakan
//             </h2>
//             <p className="text-xs text-muted-foreground mb-4">
//               Gunakan GPS otomatis atau isi manual
//             </p>

//             <Button
//               type="button"
//               variant="outline"
//               className="w-full gap-2 mb-4"
//               onClick={detectLocation}
//               disabled={locating}
//             >
//               {locating ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Navigation className="w-4 h-4" />
//               )}
//               {locating ? "Mendeteksi lokasi…" : "Gunakan Lokasi Saya"}
//             </Button>

//             {locError && (
//               <div className="flex items-center gap-2 text-xs text-destructive mb-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
//                 <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
//                 {locError}
//               </div>
//             )}

//             {form.lat && (
//               <div className="flex items-center gap-2 text-xs text-primary mb-4 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
//                 <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
//                 GPS: {form.lat.toFixed(5)}, {form.lng?.toFixed(5)}
//               </div>
//             )}

//             <div className="space-y-3">
//               <div className="space-y-1.5">
//                 <Label htmlFor="address">Nama Jalan / Alamat *</Label>
//                 <Input
//                   id="address"
//                   value={form.address}
//                   onChange={(e) =>
//                     setForm((f) => ({ ...f, address: e.target.value }))
//                   }
//                   placeholder="Jl. Sudirman No. 45"
//                   className="bg-background"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1.5">
//                   <Label htmlFor="district">Kecamatan / Kelurahan</Label>
//                   <Input
//                     id="district"
//                     value={form.district}
//                     onChange={(e) =>
//                       setForm((f) => ({ ...f, district: e.target.value }))
//                     }
//                     placeholder="Sukajadi"
//                     className="bg-background"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label htmlFor="city">Kota</Label>
//                   <Input
//                     id="city"
//                     value={form.city}
//                     onChange={(e) =>
//                       setForm((f) => ({ ...f, city: e.target.value }))
//                     }
//                     placeholder="Pekanbaru"
//                     className="bg-background"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Button
//             className="w-full"
//             size="lg"
//             disabled={!canProceedLocation}
//             onClick={() => setStep("details")}
//           >
//             Lanjut ke Detail
//           </Button>
//         </div>
//       )}

//       {/* ── Step 2: Details ── */}
//       {step === "details" && (
//         <div className="space-y-5">
//           <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
//             <div>
//               <h2 className="font-heading font-bold text-foreground mb-1">
//                 Detail Kerusakan
//               </h2>
//               <p className="text-xs text-muted-foreground">
//                 Deskripsikan kondisi jalan secara singkat
//               </p>
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="title">Judul Laporan *</Label>
//               <Input
//                 id="title"
//                 value={form.title}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, title: e.target.value }))
//                 }
//                 placeholder="Lubang besar di tengah jalan"
//                 className="bg-background"
//                 maxLength={80}
//               />
//               <p className="text-[10px] text-muted-foreground text-right">
//                 {form.title.length}/80
//               </p>
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="description">Deskripsi *</Label>
//               <Textarea
//                 id="description"
//                 value={form.description}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, description: e.target.value }))
//                 }
//                 placeholder="Ukuran lubang, kondisi sekitar, potensi bahaya…"
//                 rows={3}
//                 className="bg-background resize-none"
//                 maxLength={500}
//               />
//               <p className="text-[10px] text-muted-foreground text-right">
//                 {form.description.length}/500
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <Label>Kategori *</Label>
//                 <Select
//                   value={form.category}
//                   onValueChange={(v) =>
//                     setForm((f) => ({ ...f, category: v as DamageCategory }))
//                   }
//                 >
//                   <SelectTrigger className="bg-background">
//                     <SelectValue placeholder="Pilih…" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
//                       <SelectItem key={k} value={k}>
//                         {v}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-1.5">
//                 <Label>Urgensi (opsional)</Label>
//                 <Select
//                   value={form.urgency}
//                   onValueChange={(v) =>
//                     setForm((f) => ({ ...f, urgency: v as Urgency }))
//                   }
//                 >
//                   <SelectTrigger className="bg-background">
//                     <SelectValue placeholder="Pilih…" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Object.entries(URGENCY_LABEL).map(([k, v]) => (
//                       <SelectItem key={k} value={k}>
//                         {v}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {/* Image upload */}
//           <div className="rounded-2xl border border-border bg-card p-5">
//             <h2 className="font-heading font-bold text-foreground mb-1">
//               Foto Kerusakan *
//             </h2>
//             <p className="text-xs text-muted-foreground mb-4">
//               Maks. 4 foto. Foto yang jelas membantu proses verifikasi.
//             </p>

//             <div className="grid grid-cols-4 gap-2">
//               {form.images.map((img, i) => (
//                 <div
//                   key={i}
//                   className="relative aspect-square rounded-xl overflow-hidden border border-border"
//                 >
//                   <img
//                     src={img.url}
//                     alt=""
//                     className="w-full h-full object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(i)}
//                     className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
//                   >
//                     <X className="w-3 h-3 text-white" />
//                   </button>
//                 </div>
//               ))}
//               {form.images.length < 4 && (
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className={cn(
//                     "aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors",
//                     form.images.length === 0 && "col-span-4 aspect-video",
//                   )}
//                 >
//                   <Camera className="w-6 h-6" />
//                   <span className="text-[10px] font-medium">
//                     {form.images.length === 0 ? "Tambah Foto" : "+"}
//                   </span>
//                 </button>
//               )}
//             </div>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={handleImages}
//             />
//           </div>

//           <Button
//             className="w-full"
//             size="lg"
//             disabled={!canProceedDetails}
//             onClick={() => setStep("review")}
//           >
//             Tinjau Laporan
//           </Button>
//         </div>
//       )}

//       {/* ── Step 3: Review ── */}
//       {step === "review" && (
//         <div className="space-y-4">
//           <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
//             <h2 className="font-heading font-bold text-foreground">
//               Tinjau Laporan
//             </h2>

//             {/* Location summary */}
//             <div className="p-3 rounded-xl bg-muted/50 space-y-1">
//               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//                 Lokasi
//               </p>
//               <p className="text-sm font-medium text-foreground">
//                 {form.address}
//               </p>
//               {form.district && (
//                 <p className="text-xs text-muted-foreground">
//                   {form.district}, {form.city}
//                 </p>
//               )}
//               {form.lat && (
//                 <p className="text-[10px] font-mono text-muted-foreground">
//                   {form.lat.toFixed(5)}, {form.lng?.toFixed(5)}
//                 </p>
//               )}
//             </div>

//             {/* Details summary */}
//             <div className="p-3 rounded-xl bg-muted/50 space-y-2">
//               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//                 Detail
//               </p>
//               <p className="text-sm font-bold text-foreground">{form.title}</p>
//               <p className="text-xs text-muted-foreground leading-relaxed">
//                 {form.description}
//               </p>
//               <div className="flex gap-1.5 flex-wrap pt-1">
//                 {form.category && (
//                   <Badge variant="outline" className="text-[10px]">
//                     {CATEGORY_LABEL[form.category as DamageCategory]}
//                   </Badge>
//                 )}
//                 {form.urgency && (
//                   <Badge variant="outline" className="text-[10px]">
//                     {URGENCY_LABEL[form.urgency as Urgency]}
//                   </Badge>
//                 )}
//               </div>
//             </div>

//             {/* Images preview */}
//             {form.images.length > 0 && (
//               <div>
//                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
//                   Foto ({form.images.length})
//                 </p>
//                 <div className="grid grid-cols-4 gap-2">
//                   {form.images.map((img, i) => (
//                     <div
//                       key={i}
//                       className="aspect-square rounded-xl overflow-hidden border border-border"
//                     >
//                       <img
//                         src={img.url}
//                         alt=""
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <Button
//             className="w-full gap-2"
//             size="lg"
//             onClick={handleSubmit}
//             disabled={submitting}
//           >
//             {submitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" /> Mengirim…
//               </>
//             ) : (
//               <>
//                 <MapPin className="w-4 h-4" /> Kirim Laporan
//               </>
//             )}
//           </Button>

//           <p className="text-[11px] text-muted-foreground text-center">
//             Laporan yang dikirim akan diverifikasi sebelum ditampilkan di peta.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
