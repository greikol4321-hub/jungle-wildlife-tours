"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", href: "/" },
  { key: "tours", href: "/tours" },
  { key: "about", href: "/about" },
  { key: "gallery", href: "/gallery" },
  { key: "reviews", href: "/reviews" },
  { key: "contact", href: "/contact" },
] as const;

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLocale = locale === "es" ? "en" : "es";
  const localeSwitchHref = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="sticky top-0 z-40 border-b border-canopy-950/10 bg-bone-50/80 backdrop-blur supports-[backdrop-filter]:bg-bone-50/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-canopy-950 font-heading"
        >
          Jungle Wildlife Tours
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "text-sm font-medium text-canopy-950/70 hover:text-canopy-950",
                pathname === item.href && "text-canopy-600"
              )}
            >
              {t(item.key)}
            </Link>
          ))}

          <Link
            href={localeSwitchHref}
            className="rounded-full border border-canopy-950/15 px-3 py-1.5 text-xs font-semibold text-canopy-950"
          >
            {otherLocale.toUpperCase()}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-canopy-950 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="sr-only">{t("home")}</span>
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-canopy-950/10 bg-bone-50 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-sm font-medium text-canopy-950/80 hover:text-canopy-950",
                  pathname === item.href && "text-canopy-600"
                )}
              >
                {t(item.key)}
              </Link>
            ))}

            <Link
              href={localeSwitchHref}
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-full border border-canopy-950/15 px-4 py-2 text-xs font-semibold text-canopy-950"
            >
              {otherLocale.toUpperCase()}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
