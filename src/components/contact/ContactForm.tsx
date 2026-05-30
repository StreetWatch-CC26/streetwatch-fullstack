"use client";

import { useForm, ValidationError } from "@formspree/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [state, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_FORMSPREE_ID as string,
  );

  if (state.succeeded) {
    return (
      <Card className="border-primary/20 bg-primary/5 py-5">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Pesan Terkirim!</h3>
            <p className="text-muted-foreground">
              Terima kasih telah menghubungi kami. Kami akan segera membalas
              pesan Anda.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Kirim Pesan Lain
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-border/50 py-5">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Kirim Pesan</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Isi form di bawah ini dan kami akan segera menghubungi Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Nama Depan<span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Budi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Nama Belakang<span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Santoso"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email<span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="budi@example.com"
              required
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-destructive text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">
              Subjek<span className="text-destructive">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Pertanyaan terkait Street Watch"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              Pesan<span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tulis pesan Anda di sini..."
              className="min-h-30 resize-y"
              required
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
              className="text-destructive text-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-primary-foreground font-semibold"
            disabled={state.submitting}
          >
            {state.submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Pesan"
            )}
          </Button>

          {state.errors && (
            <p className="text-destructive text-sm text-center">
              Terjadi kesalahan. Silakan coba lagi nanti.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
