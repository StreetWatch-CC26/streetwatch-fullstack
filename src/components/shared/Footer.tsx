import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-secondary px-5 md:px-20">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        {/* BRAND */}
        <div>
          <h3 className="text-lg font-serif font-semibold">StreetWatch</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Platform monitoring jalan rusak berbasis AI untuk membantu
            percepatan perbaikan infrastruktur di Indonesia.
          </p>
        </div>

        {/* NAV */}
        <div>
          <h4 className="text-sm font-medium mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/">Beranda</Link>
            </li>
            <li>
              <Link href="/about">Tentang Kami</Link>
            </li>
            <li>
              <Link href="/partnership">Kemitraan</Link>
            </li>
            <li>
              <Link href="/contact">Hubungi Kami</Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-sm font-medium mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="mailto:streetwatch.ai@gmail.com"
                className="hover:underline"
              >
                Email: streetwatch.ai@mail.com
              </a>
            </li>
            <li>Indonesia</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t">
        <div className="container py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StreetWatch. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <Image
          src="/logo-light.png"
          alt="Logo"
          width={1000}
          height={1000}
          className="block dark:hidden w-full h-auto max-w-6xl"
        />
        {/* Dark mode */}
        <Image
          src="/logo-dark.png"
          alt="Logo"
          width={1000}
          height={1000}
          className="hidden dark:block w-full h-auto max-w-6xl"
        />
      </div>
    </footer>
  );
}
