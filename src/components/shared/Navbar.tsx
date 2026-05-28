"use client";

import Link from "next/link";
import Image from "next/image";
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

      <SheetContent
        side="left"
        className="w-50 px-5"
        aria-describedby={undefined}
      >
        <SheetTitle aria-describedby={undefined} className="hidden">
          Menu
        </SheetTitle>
        <div className="flex flex-col h-full my-5 mx-3">
          {/* LOGO */}
          <div className="items-center pb-3 mb-6 border-b border-border">
            <Image
              src="/logo-light.png"
              alt="Logo"
              width={120}
              height={40}
              className="block dark:hidden w-24 h-auto"
            />
            {/* Dark mode */}
            <Image
              src="/logo-dark.png"
              alt="Logo"
              width={120}
              height={40}
              className="hidden dark:block w-24 h-auto"
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
export default function Navbar({ isLoggedIn, pathname }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-5 md:px-20">
        {/* LEFT */}
        <div className="flex items-center gap-2 md:gap-4">
          <MobileNavbar pathname={pathname} isLoggedIn={isLoggedIn} />

          <Link href="/" className="items-center flex">
            <Image
              src="/logo-light.png"
              alt="Logo"
              width={120}
              height={40}
              className="block dark:hidden w-24 md:w-26 lg:w-30 h-auto transition-all"
            />
            {/* Dark mode */}
            <Image
              src="/logo-dark.png"
              alt="Logo"
              width={120}
              height={40}
              className="hidden dark:block w-24 md:w-30 h-auto transition-all"
            />
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center md:gap-3 lg:gap-10 md:text-xs lg:text-sm">
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

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden md:flex" />
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
