import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("footer");

  return (
    <footer className="relative">
      <div className="bg-surface border-t border-border">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* ─── Brand ─── */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="font-heading text-xl font-bold text-text tracking-tight">
                Jungle Wildlife Tours
              </p>
              <div className="mt-2 h-0.5 w-10 rounded-full bg-emerald" />
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
                  { href: "/tours/barco-manglar-damas", key: "boatMangrove" },
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
                    href="https://wa.me/50684230485"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 transition-colors duration-300 hover:text-emerald"
                  >
                    {/* WhatsApp SVG */}
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-emerald"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.814-6.293-2.176l-.44-.36-2.614.876.876-2.614-.36-.44A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                    </svg>
                    WhatsApp
                  </a>
                </li>

                {/* Email */}
                <li>
                  <a
                    href="mailto:junglewildlifetours.cr@gmail.com"
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
                    junglewildlifetours.cr@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ─── Social ─── */}
          <div className="mt-10 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald">
                {t("followUs")}
              </p>
              <div className="flex items-center gap-3">
                {[
                  { name: "Facebook", href: "https://facebook.com/junglewildlifetourscr", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                  { name: "Instagram", href: "https://instagram.com/junglewildlifetours", icon: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 12a4 4 0 110-8 4 4 0 010 8zm0-6a2 2 0 100 4 2 2 0 000-4zm5-3a1 1 0 110-2 1 1 0 010 2z" },
                  { name: "TripAdvisor", href: "https://tripadvisor.com/Attraction_Review-g309208-d1234567", icon: "M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 6 6 0 0 0 6-5.998 5.982 5.982 0 0 0-1.957-4.432L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM12 6.255c1.531 0 3.063.303 4.504.903C13.943 8.138 12 10.43 12 13.1c0-2.671-1.942-4.962-4.504-5.942A11.72 11.72 0 0 1 12 6.256zM6.002 9.157a4.059 4.059 0 1 1 0 8.118 4.059 4.059 0 0 1 0-8.118zm11.992.002a4.057 4.057 0 1 1 .003 8.115 4.057 4.057 0 0 1-.003-8.115zm-11.992 1.93a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256zm11.992 0a2.128 2.128 0 0 0 0 4.256 2.128 2.128 0 0 0 0-4.256z" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-300 hover:border-emerald/40 hover:bg-emerald-dim hover:text-emerald"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d={s.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Bottom bar ─── */}
          <div className="mt-8 border-t border-border">
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-text-muted text-xs">
              <p>
                © {new Date().getFullYear()} Jungle Wildlife Tours.{" "}
                {t("legal")}
              </p>
              <p className="text-text-muted/60 text-[10px] tracking-wider">
                Desarrollado por <span className="text-emerald/60">Greikol Q.A</span>
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

            {/* Nature-inspired decorative line */}
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />
          </div>
        </div>
      </div>
    </footer>
  );
}
