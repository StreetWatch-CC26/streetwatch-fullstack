// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const json: { success: boolean; message?: string } = await res.json();

    if (!json.success) {
      setError(json.message ?? "Registrasi gagal.");
      setLoading(false);
      return;
    }

    // Auto-login setelah register
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard/map",
    });
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/set-password" });
  }

  const passwordValid = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  return (
    <div>
      {/* Brand */}
      <div className="flex flex-col items-center gap-2 py-5 md:py-10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Buat Akun
        </h1>
        <p className="text-sm text-muted-foreground">
          Bergabung dengan StreetWatch
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Google */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={handleGoogle}
        disabled={loading}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Daftar dengan Google
      </Button>

      <div className="relative py-3 md:py-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">atau</span>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">
            Nama Lengkap
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Budi Santoso"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <RiEyeOffLine className="w-4 h-4" />
              ) : (
                <RiEyeLine className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password rules */}
          {password.length > 0 && (
            <ul className="space-y-1 mt-2">
              {[
                {
                  key: "length",
                  text: "Minimal 8 karakter",
                  ok: passwordValid.length,
                },
                {
                  key: "upper",
                  text: "1 huruf kapital",
                  ok: passwordValid.upper,
                },
                { key: "number", text: "1 angka", ok: passwordValid.number },
              ].map((rule) => (
                <li
                  key={rule.key}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <CheckCircle2
                    className={
                      rule.ok
                        ? "w-3.5 h-3.5 text-green-500"
                        : "w-3.5 h-3.5 text-muted-foreground/40"
                    }
                  />
                  <span
                    className={
                      rule.ok ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    {rule.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !Object.values(passwordValid).every(Boolean)}
        >
          {loading ? "Mendaftar…" : "Buat Akun"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}

// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSeparator,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import Image from "next/image";
// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

// // ── Icon Google ───────────────────────────────────────────────────────────────
// function GoogleIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       className="size-4"
//     >
//       <path
//         d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
//         fill="currentColor"
//       />
//     </svg>
//   );
// }

// // ── Tipe error dari API ───────────────────────────────────────────────────────
// interface FieldErrors {
//   name?: string[];
//   email?: string[];
//   password?: string[];
// }

// // ── Helper validasi password lokal (mirror Zod schema backend) ────────────────
// function validatePassword(pw: string): string | null {
//   if (pw.length < 8) return "Minimal 8 karakter.";
//   if (!/[A-Z]/.test(pw)) return "Harus mengandung huruf kapital.";
//   if (!/[0-9]/.test(pw)) return "Harus mengandung angka.";
//   return null;
// }

// // ── Indikator kekuatan password ───────────────────────────────────────────
// function PasswordStrength({ password }: { password: string }) {
//   if (!password) return null;
//   const checks = [
//     password.length >= 8,
//     /[A-Z]/.test(password),
//     /[0-9]/.test(password),
//     /[^A-Za-z0-9]/.test(password),
//   ];
//   const score = checks.filter(Boolean).length;
//   const colors = [
//     "bg-destructive",
//     "bg-orange-400",
//     "bg-yellow-400",
//     "bg-green-500",
//   ];
//   const labels = ["Sangat lemah", "Lemah", "Cukup", "Kuat"];

//   return (
//     <div className="mt-1.5 space-y-1">
//       <div className="flex gap-1">
//         {[0, 1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className={cn(
//               "h-1 flex-1 rounded-full transition-colors duration-300",
//               i < score ? colors[score - 1] : "bg-muted",
//             )}
//           />
//         ))}
//       </div>
//       <p
//         className={cn(
//           "text-xs",
//           score >= 3 ? "text-muted-foreground" : "text-orange-500",
//         )}
//       >
//         {labels[score - 1] ?? ""}
//       </p>
//     </div>
//   );
// }

// // ── Komponen ──────────────────────────────────────────────────────────────────
// export function RegisterForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [globalError, setGlobalError] = useState<string | null>(null);
//   const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
//   const [success, setSuccess] = useState(false);

//   const [loadingRegister, setLoadingRegister] = useState(false);
//   const [loadingGoogle, setLoadingGoogle] = useState(false);

//   const isBusy = loadingRegister || loadingGoogle;

//   // ── Validasi sisi klien ───────────────────────────────────────────────────
//   function validateClient(): FieldErrors {
//     const errs: FieldErrors = {};
//     if (!name.trim() || name.trim().length < 2)
//       errs.name = ["Nama minimal 2 karakter."];
//     if (!email || !/\S+@\S+\.\S+/.test(email))
//       errs.email = ["Format email tidak valid."];
//     const pwErr = validatePassword(password);
//     if (pwErr) errs.password = [pwErr];
//     if (password !== confirmPassword)
//       errs.password = [
//         ...(errs.password ?? []),
//         "Password dan konfirmasi tidak cocok.",
//       ];
//     return errs;
//   }

//   // ── Submit register ───────────────────────────────────────────────────────
//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setGlobalError(null);
//     setFieldErrors({});

//     // Validasi lokal dulu
//     const clientErrs = validateClient();
//     if (Object.keys(clientErrs).length > 0) {
//       setFieldErrors(clientErrs);
//       return;
//     }

//     setLoadingRegister(true);
//     try {
//       // 1. Daftarkan akun ke API
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name.trim(),
//           email,
//           password,
//           confirmPassword,
//         }),
//       });

//       const json = await res.json();

//       if (res.status === 409) {
//         setFieldErrors({ email: ["Email ini sudah terdaftar."] });
//         return;
//       }

//       if (res.status === 400) {
//         // Zod field errors dari backend
//         setFieldErrors(json.errors ?? {});
//         if (!json.errors) setGlobalError(json.message ?? "Data tidak valid.");
//         return;
//       }

//       if (!res.ok) {
//         setGlobalError(json.message ?? "Terjadi kesalahan. Silakan coba lagi.");
//         return;
//       }

//       // 2. Tampilkan feedback sukses sebentar
//       setSuccess(true);

//       // 3. Auto-login dengan credentials yang sama
//       const signInRes = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       });

//       if (signInRes?.ok) {
//         router.push("/");
//         router.refresh();
//       } else {
//         // Akun sudah terbuat tapi auto-login gagal — arahkan ke login manual
//         router.push("/login?registered=1");
//       }
//     } catch {
//       setGlobalError("Terjadi kesalahan jaringan. Periksa koneksi Anda.");
//     } finally {
//       setLoadingRegister(false);
//     }
//   }

//   // ── Login Google ──────────────────────────────────────────────────────────
//   async function handleGoogle() {
//     setGlobalError(null);
//     setLoadingGoogle(true);
//     try {
//       await signIn("google", { callbackUrl: "/dashboard" });
//     } catch {
//       setGlobalError("Gagal memulai login Google. Silakan coba lagi.");
//       setLoadingGoogle(false);
//     }
//   }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card className="overflow-hidden p-0">
//         <CardContent className="grid p-0 md:grid-cols-2">
//           {/* ── Panel Gambar ── */}
//           <div className="relative hidden bg-muted md:block">
//             <Image
//               src="/placeholder.svg"
//               alt="StreetWatch illustration"
//               className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//               width={500}
//               height={500}
//             />
//           </div>

//           {/* ── Panel Form ── */}
//           <form className="p-6 md:p-8" onSubmit={handleSubmit} noValidate>
//             <FieldGroup>
//               {/* Judul */}
//               <div className="flex flex-col items-center gap-2 text-center">
//                 <h1 className="text-2xl font-bold">Buat Akun</h1>
//                 <p className="text-sm text-balance text-muted-foreground">
//                   Bergabung dan laporkan kerusakan jalan di sekitar Anda
//                 </p>
//               </div>

//               {/* Error global */}
//               {globalError && (
//                 <div
//                   role="alert"
//                   className="flex items-start gap-2.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
//                 >
//                   <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
//                   <span>{globalError}</span>
//                 </div>
//               )}

//               {/* Sukses */}
//               {success && (
//                 <div
//                   role="status"
//                   className="flex items-center gap-2.5 rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2.5 text-sm text-green-700 dark:text-green-400"
//                 >
//                   <CheckCircle2 className="size-4 shrink-0" aria-hidden />
//                   <span>Akun berhasil dibuat! Mengalihkan…</span>
//                 </div>
//               )}

//               {/* Nama */}
//               <Field>
//                 <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
//                 <Input
//                   id="name"
//                   type="text"
//                   placeholder="Budi Santoso"
//                   autoComplete="name"
//                   required
//                   disabled={isBusy}
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   aria-invalid={!!fieldErrors.name}
//                 />
//                 {fieldErrors.name && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {fieldErrors.name[0]}
//                   </p>
//                 )}
//               </Field>

//               {/* Email */}
//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="nama@contoh.com"
//                   autoComplete="email"
//                   required
//                   disabled={isBusy}
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   aria-invalid={!!fieldErrors.email}
//                 />
//                 {fieldErrors.email ? (
//                   <p className="mt-1 text-xs text-destructive">
//                     {fieldErrors.email[0]}
//                   </p>
//                 ) : (
//                   <FieldDescription>
//                     Email Anda tidak akan dibagikan kepada siapapun.
//                   </FieldDescription>
//                 )}
//               </Field>

//               {/* Password */}
//               <Field>
//                 <div className="grid grid-cols-2 gap-4">
//                   {/* Password */}
//                   <Field>
//                     <FieldLabel htmlFor="password">Password</FieldLabel>
//                     <div className="relative">
//                       <Input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         autoComplete="new-password"
//                         required
//                         disabled={isBusy}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         aria-invalid={!!fieldErrors.password}
//                         className="pr-9"
//                       />
//                       <button
//                         type="button"
//                         tabIndex={-1}
//                         className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
//                         onClick={() => setShowPassword((v) => !v)}
//                         aria-label={
//                           showPassword
//                             ? "Sembunyikan password"
//                             : "Tampilkan password"
//                         }
//                       >
//                         {showPassword ? (
//                           <EyeOff className="size-4" />
//                         ) : (
//                           <Eye className="size-4" />
//                         )}
//                       </button>
//                     </div>
//                     <PasswordStrength password={""} />
//                   </Field>

//                   {/* Konfirmasi */}
//                   <Field>
//                     <FieldLabel htmlFor="confirm-password">
//                       Konfirmasi
//                     </FieldLabel>
//                     <Input
//                       id="confirm-password"
//                       type={showPassword ? "text" : "password"}
//                       autoComplete="new-password"
//                       required
//                       disabled={isBusy}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       aria-invalid={
//                         !!confirmPassword && confirmPassword !== password
//                       }
//                     />
//                     {confirmPassword && confirmPassword !== password && (
//                       <p className="mt-1 text-xs text-destructive">
//                         Tidak cocok.
//                       </p>
//                     )}
//                     {confirmPassword && confirmPassword === password && (
//                       <p className="mt-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
//                         <CheckCircle2 className="size-3" /> Cocok
//                       </p>
//                     )}
//                   </Field>
//                 </div>

//                 {fieldErrors.password && (
//                   <p className="mt-1 text-xs text-destructive">
//                     {fieldErrors.password[0]}
//                   </p>
//                 )}
//                 {!fieldErrors.password && (
//                   <FieldDescription>
//                     Minimal 8 karakter, 1 huruf kapital, 1 angka.
//                   </FieldDescription>
//                 )}
//               </Field>

//               {/* Tombol Daftar */}
//               <Field>
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isBusy || success}
//                 >
//                   {loadingRegister ? (
//                     <>
//                       <Loader2 className="mr-2 size-4 animate-spin" />
//                       Membuat akun…
//                     </>
//                   ) : (
//                     "Buat Akun"
//                   )}
//                 </Button>
//               </Field>

//               {/* Separator */}
//               <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
//                 Atau daftar dengan
//               </FieldSeparator>

//               {/* Tombol Google */}
//               <Field>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full"
//                   onClick={handleGoogle}
//                   disabled={isBusy}
//                 >
//                   {loadingGoogle ? (
//                     <Loader2 className="size-4 animate-spin" />
//                   ) : (
//                     <GoogleIcon />
//                   )}
//                   <span className="ml-2">
//                     {loadingGoogle
//                       ? "Mengarahkan ke Google…"
//                       : "Daftar dengan Google"}
//                   </span>
//                 </Button>
//               </Field>

//               {/* Link ke Login */}
//               <FieldDescription className="text-center text-sm">
//                 Sudah punya akun?{" "}
//                 <Link
//                   href="/login"
//                   className="font-medium underline underline-offset-2"
//                 >
//                   Masuk
//                 </Link>
//               </FieldDescription>
//             </FieldGroup>
//           </form>
//         </CardContent>
//       </Card>

//       <FieldDescription className="px-6 text-center text-xs">
//         Dengan mendaftar, Anda menyetujui{" "}
//         <a href="#" className="underline underline-offset-2">
//           Syarat Layanan
//         </a>{" "}
//         dan{" "}
//         <a href="#" className="underline underline-offset-2">
//           Kebijakan Privasi
//         </a>{" "}
//         kami.
//       </FieldDescription>
//     </div>
//   );
// }
