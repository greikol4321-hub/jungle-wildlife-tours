import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="relative">
      <div className="bg-surface border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* ─── Brand ─── */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="font-heading text-xl font-bold text-text tracking-tight">
                Jungle Wildlife Tours
              </p>
              <p className="mt-3 text-text-secondary text-sm leading-relaxed max-w-[260px]">
                {t("description")}
              </p>

              {/* Certified badge */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-emerald-dim px-3 py-1.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse-glow"
                />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-emerald">
                  {t("certifiedGuide")}
                </span>
              </div>

              {/* Decorative emerald line */}
              <div className="mt-6 h-px w-12 bg-gradient-to-r from-emerald to-transparent" />
            </div>

            {/* ─── Navigation ─── */}
            <div className="lg:border-l lg:border-border lg:pl-8">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald mb-5">
                {t("navigation")}
              </p>
              <ul className="space-y-3">
                {[
                  { href: "/", key: "home" },
                  { href: "/tours", key: "tours" },
                  { href: "/about", key: "about" },
                  { href: "/contact", key: "contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-text-secondary text-sm transition-colors duration-300 hover:text-emerald"
                    >
                      {t(`nav.${link.key}`)}
                      <span
                        aria-hidden="true"
                        className="inline-block translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 text-emerald text-[11px]"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Tours ─── */}
            <div className="lg:border-l lg:border-border lg:pl-8">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald mb-5">
                {t("popularTours")}
              </p>
              <ul className="space-y-3">
                {[
                  { href: "/tours/safari-manuel-antonio", key: "groundSafari" },
                  { href: "/tours/kayak-manglar-damas", key: "mangroveWalk" },
                  { href: "/tours/caminata-nocturna", key: "nightWalk" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-text-secondary text-sm transition-colors duration-300 hover:text-emerald"
                    >
                      {t(`tourLinks.${link.key}`)}
                      <span
                        aria-hidden="true"
                        className="inline-block translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 text-emerald text-[11px]"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Contact ─── */}
            <div className="lg:border-l lg:border-border lg:pl-8">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald mb-5">
                {t("contact")}
              </p>
              <ul className="space-y-3 text-text-secondary text-sm">
                {/* Location */}
                <li className="flex items-start gap-2.5">
                  {/* MapPin inline SVG — no lucide-react in server component */}
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{t("location")}, Costa Rica</span>
                </li>

                {/* WhatsApp */}
                <li>
                  <a
                    href="https://wa.me/50688888888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 transition-colors duration-300 hover:text-emerald"
                  >
                    {/* Phone inline SVG */}
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-emerald"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    WhatsApp
                  </a>
                </li>

                {/* Email */}
                <li>
                  <a
                    href="mailto:info@junglewildlifetours.com"
                    className="inline-flex items-center gap-2.5 transition-colors duration-300 hover:text-emerald"
                  >
                    {/* Mail inline SVG */}
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-emerald"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    info@junglewildlifetours.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ─── Bottom bar ─── */}
          <div className="mt-14 border-t border-border">
            <div className="h-px w-full bg-gradient-to-r from-emerald/30 via-emerald/10 to-transparent" />
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-text-muted text-xs">
              <p>
                © {new Date().getFullYear()} Jungle Wildlife Tours.{" "}
                {t("legal")}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="transition-colors duration-300 hover:text-emerald"
                >
                  {t("privacy")}
                </Link>
                <span className="text-border-strong">·</span>
                <Link
                  href="/terms"
                  className="transition-colors duration-300 hover:text-emerald"
                >
                  {t("terms")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
