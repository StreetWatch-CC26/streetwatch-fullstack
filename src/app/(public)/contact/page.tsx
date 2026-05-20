import { RiInstagramLine, RiMailLine, RiMapPin2Line } from "@remixicon/react";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div
      id="contact"
      className="min-h-screen bg-background text-foreground py-10 px-4 md:py-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-4">
            Hubungi Kami
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Ada kendala teknis atau ingin memberikan saran untuk pengembangan
            aplikasi? Tim kami siap membantu Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Info Section - Tampil di atas pada Mobile */}
          <div className="flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <RiMapPin2Line className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Lokasi Kami</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Indonesia
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <RiMailLine className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  streetwatch.ai@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <RiInstagramLine className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Instagram</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  streetwatch.ai
                </p>
              </div>
            </div>
          </div>

          {/* Form Section - Prioritas tinggi di Mobile */}
          <div className="order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
