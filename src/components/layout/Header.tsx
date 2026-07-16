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
      <style jsx>{`
        .nav-wrapper {
          position: fixed;
          top: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          width: calc(100% - 1.5rem);
          max-width: 960px;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.32, 1), opacity 400ms cubic-bezier(0.22, 1, 0.32, 1);
        }
        @media (min-width: 768px) {
          .nav-wrapper { top: 1rem; width: calc(100% - 2rem); }
        }
        .nav-wrapper.hidden {
          transform: translateX(-50%) translateY(-120%) scale(0.95);
          opacity: 0;
          pointer-events: none;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.9rem;
          background: rgba(11, 26, 15, 0.85);
          backdrop-filter: blur(20px) saturate(1.3);
          -webkit-backdrop-filter: blur(20px) saturate(1.3);
          border: 1px solid var(--color-border);
          border-radius: 100px;
          transition: background 300ms var(--ease-out), border-color 300ms var(--ease-out), box-shadow 300ms var(--ease-out);
        }
        @media (min-width: 768px) {
          .nav-inner { padding: 0.5rem 1.25rem; }
        }
        .nav-inner.scrolled {
          background: rgba(11, 26, 15, 0.95);
          border-color: var(--color-border-hover);
          box-shadow: 0 8px 32px -8px rgba(0,0,0,0.4);
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
          text-decoration: none;
          color: var(--color-text);
          transition: color 200ms var(--ease-out);
        }
        @media (min-width: 768px) {
          .logo { font-size: 0.95rem; max-width: none; }
        }
        @media (hover: hover) {
          .logo:hover { color: var(--color-emerald); }
        }
        .logo-accent { color: var(--color-emerald); }
        .logo-accent-mobile { display: inline; }
        @media (max-width: 767px) {
          .logo-accent-desktop { display: none; }
        }
        @media (min-width: 768px) {
          .logo-accent-mobile { display: none; }
        }
        .nav-links {
          display: none;
          gap: 1.5rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .nav-links { display: flex; }
        }
        .nav-links a {
          font-size: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          color: var(--color-text-secondary);
          transition: color 200ms var(--ease-out);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: var(--color-emerald);
          border-radius: 2px;
          transition: width 250ms var(--ease-out);
        }
        @media (hover: hover) {
          .nav-links a:hover { color: var(--color-text); }
          .nav-links a:hover::after { width: 100%; }
        }
        .nav-links a.active { color: var(--color-emerald); }
        .nav-links a.active::after { width: 100%; }
        .locale-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 0.85rem;
          border: 1px solid var(--color-border);
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--color-text-secondary);
          background: transparent;
          cursor: pointer;
          transition: all 200ms var(--ease-out);
        }
        @media (hover: hover) {
          .locale-btn:hover {
            border-color: var(--color-border-hover);
            color: var(--color-emerald);
            background: var(--color-emerald-dim);
          }
        }
        .nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--color-emerald) !important;
          color: var(--color-bg) !important;
          padding: 0.5rem 1.3rem !important;
          border-radius: 100px !important;
          font-weight: 600 !important;
          font-size: 0.7rem !important;
          letter-spacing: 0.06em !important;
          text-transform: uppercase !important;
          transition: all 200ms var(--ease-out) !important;
          box-shadow: 0 2px 12px -2px rgba(78,203,113,0.3);
        }
        @media (hover: hover) {
          .nav-cta:hover {
            box-shadow: 0 0 20px 4px rgba(78,203,113,0.2);
            transform: translateY(-1px);
          }
        }
        .nav-cta:active { transform: scale(0.97) !important; }

        /* Hamburger */
        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 22px;
          height: 22px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 70;
          position: relative;
        }
        .hamburger span {
          display: block;
          width: 100%;
          height: 1.5px;
          background: var(--color-text);
          border-radius: 2px;
          transition: transform 350ms cubic-bezier(0.22, 1, 0.32, 1), opacity 250ms var(--ease-out), width 350ms cubic-bezier(0.22, 1, 0.32, 1);
          transform-origin: center;
          position: absolute;
          left: 0;
        }
        .hamburger span:nth-child(1) { top: 4px; width: 100%; }
        .hamburger span:nth-child(2) { top: 10px; width: 100%; }
        .hamburger span:nth-child(3) { top: 16px; width: 100%; }
        .hamburger.open span:nth-child(1) {
          top: 10px;
          transform: rotate(45deg);
          width: 100%;
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
          width: 0;
        }
        .hamburger.open span:nth-child(3) {
          top: 10px;
          transform: rotate(-45deg);
          width: 100%;
        }
        @media (min-width: 768px) {
          .hamburger { width: 24px; height: 24px; display: none; }
        }

        /* Mobile menu - slide from right */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 350ms var(--ease-out);
        }
        .mobile-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 65;
          width: min(320px, 85vw);
          background: linear-gradient(180deg, var(--color-bg) 0%, rgba(11, 26, 15, 0.97) 100%);
          border-left: 1px solid var(--color-border);
          transform: translateX(100%);
          transition: transform 400ms cubic-bezier(0.22, 1, 0.32, 1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .mobile-panel.open {
          transform: translateX(0);
        }

        /* Panel header */
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--color-border);
        }
        .panel-logo {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text);
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px) {
          .panel-logo { font-size: 0.95rem; }
        }
        .panel-logo-accent { color: var(--color-emerald); }
        .panel-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 200ms var(--ease-out);
        }
        @media (min-width: 768px) {
          .panel-close { width: 40px; height: 40px; }
        }
        @media (hover: hover) {
          .panel-close:hover {
            background: var(--color-surface-elevated);
            color: var(--color-text);
            border-color: var(--color-border-strong);
            transform: scale(1.05);
          }
        }

        /* Nav links */
        .panel-nav {
          flex: 1;
          padding: 0.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        @media (min-width: 768px) {
          .panel-nav { padding: 1.25rem 1.5rem; gap: 0.25rem; }
        }
        .panel-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 0.85rem;
          margin: 0 -0.85rem;
          border-radius: 10px;
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 500;
          text-decoration: none;
          color: var(--color-text-secondary);
          transition: all 200ms var(--ease-out);
          position: relative;
        }
        @media (min-width: 768px) {
          .panel-link { padding: 1rem 1rem; margin: 0 -1rem; font-size: 1.15rem; border-radius: 12px; }
        }
        @media (hover: hover) {
          .panel-link:hover {
            background: rgba(255, 255, 255, 0.06);
            color: var(--color-text);
          }
        }
        .panel-link.active {
          color: var(--color-emerald);
          background: var(--color-emerald-dim);
        }
        .panel-link.active::before {
          content: '';
          position: absolute;
          left: -0.85rem;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--color-emerald);
          border-radius: 0 3px 3px 0;
        }
        @media (min-width: 768px) {
          .panel-link.active::before { left: -1rem; }
        }
        .panel-link-icon {
          width: 20px;
          height: 20px;
          opacity: 0.5;
          flex-shrink: 0;
        }
        .panel-link.active .panel-link-icon {
          opacity: 1;
          color: var(--color-emerald);
        }

        /* Divider */
        .panel-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-border), transparent);
          margin: 0.5rem 1.5rem;
        }

        /* Panel footer */
        .panel-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: rgba(11, 26, 15, 0.3);
        }
        @media (min-width: 768px) {
          .panel-footer { padding: 1.5rem; gap: 0.75rem; }
        }
        .panel-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 1.25rem;
          background: var(--color-emerald);
          color: var(--color-bg);
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: all 200ms var(--ease-out);
          box-shadow: 0 4px 16px -2px rgba(78,203,113,0.4);
        }
        @media (min-width: 768px) {
          .panel-cta { padding: 1rem 1.5rem; font-size: 0.85rem; }
        }
        @media (hover: hover) {
          .panel-cta:hover {
            box-shadow: 0 4px 24px -2px rgba(78,203,113,0.5);
            transform: translateY(-1px);
          }
        }
        .panel-cta:active { transform: scale(0.98); }
        .panel-locale {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--color-text-secondary);
          background: transparent;
          cursor: pointer;
          transition: all 200ms var(--ease-out);
        }
        @media (min-width: 768px) {
          .panel-locale { padding: 0.7rem 1.25rem; font-size: 0.75rem; }
        }
        @media (hover: hover) {
          .panel-locale:hover {
            border-color: var(--color-border-hover);
            color: var(--color-emerald);
            background: var(--color-emerald-dim);
          }
        }
        .panel-locale svg {
          width: 14px;
          height: 14px;
          opacity: 0.6;
        }

        /* Staggered animation for links */
        .mobile-panel.open .panel-link {
          animation: slideInLink 400ms cubic-bezier(0.22, 1, 0.32, 1) forwards;
          opacity: 0;
          transform: translateX(20px);
        }
        .mobile-panel.open .panel-link:nth-child(1) { animation-delay: 80ms; }
        .mobile-panel.open .panel-link:nth-child(2) { animation-delay: 120ms; }
        .mobile-panel.open .panel-link:nth-child(3) { animation-delay: 160ms; }
        .mobile-panel.open .panel-link:nth-child(4) { animation-delay: 200ms; }
        .mobile-panel.open .panel-link:nth-child(5) { animation-delay: 240ms; }
        .mobile-panel.open .panel-link:nth-child(6) { animation-delay: 280ms; }

        .mobile-panel.open .panel-header,
        .mobile-panel.open .panel-footer {
          animation: slideInLink 300ms cubic-bezier(0.22, 1, 0.32, 1) forwards;
          opacity: 0;
          transform: translateX(15px);
        }
        .mobile-panel.open .panel-header { animation-delay: 40ms; }
        .mobile-panel.open .panel-footer { animation-delay: 320ms; }

        @keyframes slideInLink {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className={cn("nav-wrapper", navHidden && "hidden")}>
        <nav className={cn("nav-inner", scrolled && "scrolled")} aria-label={t("ariaNav")}>
          <Link href="/" className="logo" aria-label={t("ariaLogo")}>
            Jungle <span className="logo-accent logo-accent-desktop">Wildlife</span><span className="logo-accent logo-accent-mobile">W.</span> Tours
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
            <button
              type="button"
              className="locale-btn"
              onClick={() => router.push(pathname, { locale: otherLocale })}
            >
              {otherLocale.toUpperCase()}
            </button>
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

      {/* Mobile panel */}
      <div
        className={cn("mobile-overlay", open && "open")}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
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
          <a
            href="https://wa.me/50688888888"
            target="_blank"
            rel="noopener noreferrer"
            className="panel-cta"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("bookByWhatsApp")}
          </a>
          <button
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
    </>
  );
}
