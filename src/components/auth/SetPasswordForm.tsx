// src/app/(auth)/set-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import Image from "next/image";

export default function SetPasswordForm() {
  const { refreshSession } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordValid = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password === confirmPassword && confirmPassword.length > 0,
  };

  const allValid = Object.values(passwordValid).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allValid) return;

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmPassword }),
    });

    const json: { success: boolean; message?: string } = await res.json();

    if (!json.success) {
      setError(json.message ?? "Gagal menyimpan password.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    // Update session JWT agar hasPassword = true
    await refreshSession();
    setLoading(false);
  }

  if (success) {
    return (
      <div>
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Password Tersimpan!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Mulai sekarang kamu bisa login menggunakan email dan password.
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => router.push("/dashboard/reports")}
        >
          Ke Dashboard <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full py-5 md:py-10">
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
        Set Password
      </h1>
      <p className="text-sm text-muted-foreground mt-1 text-center">
        Tambahkan password
        <br />
        agar kamu bisa login tanpa Google.
      </p>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs">
            Password Baru
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9"
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

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs">
            Konfirmasi Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9"
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
          {confirmPassword.length > 0 && !passwordValid.match && (
            <p className="text-xs text-destructive">Password tidak cocok</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !allValid}
        >
          {loading ? "Menyimpan…" : "Simpan Password"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-xs text-muted-foreground"
          onClick={() => router.push("/dashboard/reports")}
        >
          Lewati, set nanti
        </Button>
      </form>
    </div>
  );
}
