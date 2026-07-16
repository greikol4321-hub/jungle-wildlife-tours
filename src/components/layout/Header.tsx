"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  const otherLocale = locale === "es" ? "en" : "es";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style jsx>{`
        .nav-wrapper {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          width: calc(100% - 2rem);
          max-width: 900px;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.75rem;
          background: rgba(12, 18, 12, 0.8);
          backdrop-filter: blur(24px) saturate(1.2);
          -webkit-backdrop-filter: blur(24px) saturate(1.2);
          border: 1px solid var(--color-border);
          border-radius: 100px;
          transition: background 300ms var(--ease-out), border-color 300ms var(--ease-out);
        }
        .nav-inner.scrolled {
          background: rgba(12, 18, 12, 0.9);
          border-color: var(--color-border-hover);
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }
        .logo span { color: var(--color-green); }
        .nav-links {
          display: none;
          gap: 1.75rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .nav-links { display: flex; }
        }
        .nav-links a {
          font-size: 0.72rem;
          font-weight: 400;
          text-decoration: none;
          color: var(--color-text-secondary);
          transition: color 200ms var(--ease-out);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .nav-links a:hover { color: var(--color-text); }
        .nav-links a.active { color: var(--color-green); }
        .nav-cta {
          background: var(--color-green) !important;
          color: var(--bg) !important;
          padding: 0.55rem 1.3rem !important;
          border-radius: 100px !important;
          font-weight: 500 !important;
          font-size: 0.7rem !important;
          letter-spacing: 0.06em !important;
          transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out) !important;
        }
        .nav-cta:hover { opacity: 0.88; }
        .nav-cta:active { transform: scale(0.97) !important; }
        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 18px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 60;
        }
        .hamburger span {
          display: block;
          width: 100%;
          height: 2px;
          background: var(--color-text);
          border-radius: 2px;
          transition: transform 300ms var(--ease-spring), opacity 200ms var(--ease-out);
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }
        @media (min-width: 768px) {
          .hamburger { display: none; }
        }
        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 55;
          background: rgba(6, 10, 6, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 400ms var(--ease-out);
        }
        .mobile-menu.open {
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-menu a {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 600;
          text-decoration: none;
          color: var(--color-text);
          transition: color 200ms var(--ease-out);
        }
        .mobile-menu a:hover { color: var(--color-green); }
        .mobile-menu .nav-cta {
          margin-top: 1rem;
          padding: 0.75rem 2rem !important;
          font-size: 0.8rem !important;
        }
        .mobile-menu .locale-btn {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          background: transparent;
          cursor: pointer;
          transition: border-color 200ms var(--ease-out), color 200ms var(--ease-out);
        }
        .mobile-menu .locale-btn:hover {
          border-color: var(--color-border-hover);
          color: var(--color-green);
        }
      `}</style>

      <div className="nav-wrapper">
        <nav className={cn("nav-inner", scrolled && "scrolled")} aria-label="Navegación principal">
          <Link href="/" className="logo" aria-label="Jungle Wildlife Tours - Inicio">
            Jungle <span>Wildlife</span> Tours
          </Link>

          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  pathname === item.href && "active"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-border-hover hover:text-green"
            >
              {otherLocale.toUpperCase()}
            </Link>
            <a
              href="https://wa.me/50688888888"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
              aria-label={t("bookByWhatsApp")}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("bookByWhatsApp")}
            </a>
          </div>

          <button
            type="button"
            className={cn("hamburger", open && "open")}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </nav>

        <div
          id="mobile-menu"
          className={cn("mobile-menu", open && "open")}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(pathname === item.href && "text-green")}
            >
              {t(item.key)}
            </Link>
          ))}
          <button
            className="locale-btn"
            onClick={() => {
              const href = pathname.replace(`/${locale}/`, `/${otherLocale}/`);
              window.location.href = href;
            }}
          >
            {otherLocale.toUpperCase()}
          </button>
          <a
            href="https://wa.me/50688888888"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("bookByWhatsApp")}
          </a>
        </div>
      </div>
    </>
  );
}