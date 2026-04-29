import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiGithubFill,
} from "@remixicon/react";
import Link from "next/link";

const team = [
  {
    name: "Ali Musthafa Kamal",
    role: "Team Lead & Frontend Developer",
    image: "/images/avatars/ali.jpg",
    initials: "AMK",
    bio: "Mahasiswa Akhir dari Universitas Riau. Pernah mengikuti Coding Camp 2025.",
    links: {
      linkedin: "https://www.linkedin.com/in/alimusthafakamal/",
      instagram: "https://instagram.com/alimusthafa10/",
      github: "https://github.com/kamaldev10/",
    },
  },
  {
    name: "Rangga Adi",
    role: "Backend Developer",
    image: "/images/avatars/ali.jpg",
    initials: "RA",
    bio: "10 tahun di sektor publik. Jembatan antara StreetWatch dan pemerintah daerah.",
    links: {
      linkedin: "linkedin.com/in/ranggaadin/",
      instagram: null,
      github: null,
    },
  },
  {
    name: "Firza Hakim",
    role: "AI Engineer",
    image: "/images/avatars/ali.jpg",
    initials: "FH",
    bio: "PhD Computer Vision dari UI. Membangun model AI deteksi kerusakan dari nol.",
    links: {
      linkedin: "https://www.linkedin.com/in/firzahakim/",
      instagram: "#",
      github: "#",
    },
  },

  {
    name: "⁠Dzakiya Hakima Adila",
    role: "AI Engineer",
    image: "/images/avatars/ali.jpg",
    initials: "DHA",
    bio: "Ex-Tokopedia design lead. Membuat teknologi kompleks terasa sederhana bagi semua orang.",
    links: {
      linkedin: "https://linkedin.com/in/dzakiya-hakima-adila/",
      instagram: "#",
      github: null,
    },
  },
  {
    name: "Della Nurizki",
    role: "Data Scientist",
    image: "/images/avatars/ali.jpg",
    initials: "DN",
    bio: "Full-stack + DevOps. Menjaga StreetWatch tetap berjalan 24/7 dengan uptime 99.9%.",
    links: {
      linkedin: "https://www.linkedin.com/in/dellanurizki/",
      instagram: null,
      github: "#",
    },
  },
  {
    name: "Moch.Alif Budi Setyawan",
    role: "Data Scientist",
    image: "/images/avatars/ali.jpg",
    initials: "ABS",
    bio: "Membangun jaringan 50.000+ pelapor aktif dan menjaga hubungan komunitas di 18 kota.",
    links: {
      linkedin: "https://www.linkedin.com/in/alifbudisetyawan/",
      instagram: "#",
      github: null,
    },
  },
];

// Cycle through a set of muted accent backgrounds
const avatarColors = [
  "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300",
  "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
  "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
  "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
  "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
];

export function TeamSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            Tim Kami
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight max-w-md">
              Orang-orang di balik StreetWatch
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Kecil, tapi berkomitmen penuh. Kami adalah tim yang percaya bahwa
              teknologi bisa mengubah pelayanan publik.
            </p>
          </div>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12 shrink-0">
                  {/* Gunakan AvatarImage untuk foto profil */}
                  <AvatarImage
                    src={member.image}
                    alt={member.name}
                    className="object-cover"
                  />

                  {/* Fallback muncul jika src kosong atau gambar gagal diload */}
                  <AvatarFallback
                    className={`font-bold text-sm ${avatarColors[i % avatarColors.length]}`}
                  >
                    {member.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-foreground text-base leading-tight">
                    {member.name}
                  </div>
                  <div className="text-xs text-primary font-medium mt-0.5">
                    {member.role}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {member.bio}
              </p>

              {/* Social links */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                {member.links.linkedin && (
                  <a
                    href={member.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <RiLinkedinBoxFill className="w-3.5 h-3.5" />
                  </a>
                )}
                {member.links.instagram && (
                  <a
                    href={member.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    aria-label="Instagram"
                  >
                    <RiInstagramFill className="w-3.5 h-3.5" />
                  </a>
                )}
                {member.links.github && (
                  <a
                    href={member.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    aria-label="GitHub"
                  >
                    <RiGithubFill className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Join the team CTA */}
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Tertarik bergabung dengan tim kami?
          </p>
          <Link
            href="/contact/#contact-us"
            className="text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            Hubungi kontak tertera →
          </Link>
        </div>
      </div>
    </section>
  );
}
