// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard/reports";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah.");
      return;
    }

    router.push(callbackUrl);
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div>
      {/* Brand */}
      <div className="flex flex-col items-center gap-2 py-5 md:py-10">
        <div className="relative w-18 h-16 bg-primary/20 dark:bg-primary/90 rounded-lg flex items-center justify-center p-1">
          <Image
            src="/images/png_favicon_light.png"
            alt="StreetWatch Logo"
            width={100}
            height={100}
            className="hidden dark:block"
          />
          <Image
            src="/images/png_favicon_dark.png"
            alt="StreetWatch Logo"
            width={100}
            height={100}
            className="block dark:hidden"
          />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Street<span className="text-primary">Watch AI</span>
        </h1>
        <p className="text-sm text-muted-foreground">Masuk ke akun kamu</p>
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
        Masuk dengan Google
      </Button>

      <div className="relative py-3 md:py-3">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">atau</span>
        </div>
      </div>

      {/* Credentials form */}
      <form onSubmit={handleCredentials} className="space-y-4">
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
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Masuk"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Daftar
        </Link>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Atau kembali ke{" "}
        <Link
          href="/"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Beranda
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
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { Loader2, AlertCircle } from "lucide-react";

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

// // ── Map error code NextAuth → pesan Indonesia ─────────────────────────────────
// const AUTH_ERROR_MAP: Record<string, string> = {
//   CredentialsSignin:
//     "Email atau password salah. Periksa kembali dan coba lagi.",
//   OAuthAccountNotLinked:
//     "Email ini sudah terdaftar dengan metode lain. Gunakan metode login yang sama.",
//   OAuthSignin: "Gagal memulai login Google. Silakan coba lagi.",
//   OAuthCallback: "Gagal menyelesaikan login Google. Silakan coba lagi.",
//   OAuthCreateAccount: "Gagal membuat akun via Google. Silakan coba lagi.",
//   EmailCreateAccount: "Gagal membuat akun. Silakan coba lagi.",
//   Callback: "Terjadi kesalahan saat login. Silakan coba lagi.",
//   SessionRequired: "Sesi habis. Silakan login kembali.",
//   Default: "Terjadi kesalahan. Silakan coba lagi.",
// };

// function resolveError(code: string | null): string | null {
//   if (!code) return null;
//   return AUTH_ERROR_MAP[code] ?? AUTH_ERROR_MAP.Default;
// }

// // ── Komponen ──────────────────────────────────────────────────────────────────
// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

//   // Error dari URL param (redirect dari NextAuth saat OAuth gagal)
//   const urlError = searchParams.get("error");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(resolveError(urlError));
//   const [loadingCreds, setLoadingCreds] = useState(false);
//   const [loadingGoogle, setLoadingGoogle] = useState(false);

//   const isBusy = loadingCreds || loadingGoogle;

//   // ── Login credentials ─────────────────────────────────────────────────────
//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError(null);
//     setLoadingCreds(true);

//     try {
//       const res = await signIn("credentials", {
//         email,
//         password,
//         redirect: false, // tangkap error tanpa hard redirect
//       });

//       if (res?.error) {
//         setError(resolveError(res.error));
//       } else if (res?.ok) {
//         router.push(callbackUrl);
//         router.refresh(); // paksa re-fetch session di layout
//       }
//     } catch {
//       setError(AUTH_ERROR_MAP.Default);
//     } finally {
//       setLoadingCreds(false);
//     }
//   }

//   // ── Login Google ──────────────────────────────────────────────────────────
//   async function handleGoogle() {
//     setError(null);
//     setLoadingGoogle(true);
//     try {
//       // redirect: true — NextAuth handle redirect ke Google & callback
//       await signIn("google", { callbackUrl });
//     } catch {
//       // Hanya terpicu jika signIn() throw sebelum redirect
//       setError(AUTH_ERROR_MAP.OAuthSignin);
//       setLoadingGoogle(false);
//     }
//   }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card className="overflow-hidden p-0">
//         <CardContent className="grid p-0 md:grid-cols-2">
//           {/* ── Panel Form ── */}
//           <form className="p-6 md:p-8" onSubmit={handleSubmit} noValidate>
//             <FieldGroup>
//               {/* Judul */}
//               <div className="flex flex-col items-center gap-2 text-center">
//                 <h1 className="text-2xl font-bold">Selamat Datang</h1>
//                 <p className="text-balance text-sm text-muted-foreground">
//                   Masuk ke akun StreetWatch Anda
//                 </p>
//               </div>

//               {/* Error Banner */}
//               {error && (
//                 <div
//                   role="alert"
//                   className="flex items-start gap-2.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
//                 >
//                   <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
//                   <span>{error}</span>
//                 </div>
//               )}

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
//                 />
//               </Field>

//               {/* Password */}
//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password">Password</FieldLabel>
//                   <a
//                     href="#"
//                     tabIndex={-1}
//                     className="ml-auto text-sm text-muted-foreground underline-offset-2 hover:underline"
//                   >
//                     Lupa password?
//                   </a>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   disabled={isBusy}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </Field>

//               {/* Tombol Masuk */}
//               <Field>
//                 <Button type="submit" className="w-full" disabled={isBusy}>
//                   {loadingCreds ? (
//                     <>
//                       <Loader2 className="mr-2 size-4 animate-spin" />
//                       Masuk…
//                     </>
//                   ) : (
//                     "Masuk"
//                   )}
//                 </Button>
//               </Field>

//               {/* Separator */}
//               <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
//                 Atau lanjutkan dengan
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
//                       : "Masuk dengan Google"}
//                   </span>
//                 </Button>
//               </Field>

//               {/* Link ke Register */}
//               <FieldDescription className="text-center text-sm">
//                 Belum punya akun?{" "}
//                 <Link
//                   href="/register"
//                   className="font-medium underline underline-offset-2"
//                 >
//                   Daftar sekarang
//                 </Link>
//               </FieldDescription>
//             </FieldGroup>
//           </form>

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
//         </CardContent>
//       </Card>

//       <FieldDescription className="px-6 text-center text-xs">
//         Dengan masuk, Anda menyetujui{" "}
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
