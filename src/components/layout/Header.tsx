"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", href: "/" },
  { key: "tours", href: "/tours" },
  { key: "about", href: "/about" },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "/contact" },
] as const;

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  const otherLocale = locale === "es" ? "en" : "es";

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const isScrolled = currentY > 30;

        setScrolled(isScrolled);

        if (currentY < 100) {
          setNavHidden(false);
        } else if (currentY > lastScrollY.current + 8) {
          setNavHidden(true);
          setOpen(false);
        } else if (currentY < lastScrollY.current - 8) {
          setNavHidden(false);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mount after hydration — prevents SSR flash of mobile panel
  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className={cn("nav-wrapper", navHidden && "hidden")}>
        <nav className={cn("nav-inner", scrolled && "scrolled")} aria-label={t("ariaNav")}>
          <Link href="/" className="logo" aria-label={t("ariaLogo")}>
            Jungle <span className="logo-accent">Wildlife</span> Tours
          </Link>

          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(pathname === item.href && "active")}
              >
                {t(item.key)}
              </Link>
            ))}
            <a
              href="https://wa.me/50688888888"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
              aria-label={t("bookByWhatsApp")}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("bookByWhatsApp")}
            </a>
            <button
              type="button"
              className="locale-btn"
              onClick={() => router.push(pathname, { locale: otherLocale })}
            >
              {otherLocale.toUpperCase()}
            </button>

          </div>

          <button
            type="button"
            className={cn("hamburger", open && "open")}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-panel"
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </nav>
      </div>

      {/* Mobile panel — mount después de hydratación para evitar flash */}
      {mounted && (
        <div
          className={cn("mobile-overlay", open && "open")}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          aria-hidden="true"
        />
      )}
      {mounted && (
        <div
          id="mobile-panel"
          className={cn("mobile-panel", open && "open")}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
        >
        <div className="panel-header">
          <Link href="/" className="panel-logo" onClick={() => setOpen(false)}>
            Jungle <span className="panel-logo-accent">Wildlife</span> Tours
          </Link>
          <button
            type="button"
            className="panel-close"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="panel-nav">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn("panel-link", pathname === item.href && "active")}
            >
              {item.key === "home" && (
                <svg className="panel-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              )}
              {item.key === "tours" && (
                <svg className="panel-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              )}
              {item.key === "about" && (
                <svg className="panel-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              )}
              {item.key === "gallery" && (
                <svg className="panel-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              )}
              {item.key === "contact" && (
                <svg className="panel-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              )}
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="panel-footer">
          <button
            type="button"
            className="panel-locale"
            onClick={() => {
              router.push(pathname, { locale: otherLocale });
              setOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            {locale === "es" ? "English" : "Español"}
          </button>
        </div>
      </div>
      )}
    </>
  );
}
