"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kemitraan", href: "/partnership" },
  { label: "Hubungi Kami", href: "/contact" },
];

// Tipe data untuk prop Navbar
type NavbarProps = {
  pathname?: string;
  isLoggedIn: boolean;
};

// ==========================================
// 1. KOMPONEN MOBILE NAVBAR (INTERNAL)
// ==========================================
function MobileNavbar({ pathname, isLoggedIn }: NavbarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-65" aria-describedby={undefined}>
        <SheetTitle aria-describedby={undefined} className="hidden">
          Menu
        </SheetTitle>
        <div className="flex flex-col h-full my-5 mx-3">
          {/* LOGO */}
          <div className="items-center mb-6">
            <Image
              src="/logo-light.png"
              alt="Logo"
              width={120}
              height={40}
              className="block dark:hidden"
            />
            {/* Dark mode */}
            <Image
              src="/logo-dark.png"
              alt="Logo"
              width={120}
              height={40}
              className="hidden dark:block"
            />
          </div>

          {/* NAV LINKS */}
          <nav className="flex flex-col gap-4 text-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative transition-colors duration-200",
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                    "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all",
                    "hover:after:w-full",
                    isActive && "after:w-full",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* TOMBOL MASUK / DASHBOARD (MOBILE) */}
          <div className="mt-6">
            {isLoggedIn ? (
              <Link href="/dashboard" className="w-full">
                <Button className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login" className="w-full">
                <Button className="w-full">Masuk</Button>
              </Link>
            )}
          </div>

          {/* BOTTOM - THEME */}
          <div className="mt-auto flex items-center justify-between pt-6 border-t border-border">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ==========================================
// 2. KOMPONEN UTAMA NAVBAR (EKSTERNAL)
// ==========================================
export default function Navbar({ isLoggedIn }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4 ms-3 md:ms-20">
          {/* PANGGIL MOBILE MENU DI SINI */}
          <MobileNavbar pathname={pathname} isLoggedIn={isLoggedIn} />

          <Link href="/" className="items-center">
            <Image
              src="/logo-light.png"
              alt="Logo"
              width={120}
              height={40}
              className="block dark:hidden"
            />
            {/* Dark mode */}
            <Image
              src="/logo-dark.png"
              alt="Logo"
              width={120}
              height={40}
              className="hidden dark:block"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10 text-sm md:ms-10 lg:ms-20">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative transition-colors duration-200",
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                    "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all",
                    "hover:after:w-full",
                    isActive && "after:w-full",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 md:me-10 lg:me-20">
          <ThemeToggle className="hidden md:flex" />
          {/* TOMBOL MASUK / DASHBOARD (DESKTOP) */}
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm" className="p-3 cursor-pointer">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" className="p-3 cursor-pointer">
                Masuk
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
