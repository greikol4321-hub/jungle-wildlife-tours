import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-heading font-bold text-text" style={{ fontSize: "1.15rem" }}>
              Jungle Wildlife Tours
            </p>
            <p className="mt-2 text-text-secondary text-sm leading-relaxed max-w-xs">
              {t("description")}
            </p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse-glow" aria-hidden="true" />
              {t("certifiedGuide")}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald mb-4">
              {t("navigation")}
            </p>
            <ul className="space-y-2.5">
              {[
                { href: "/", key: "home" },
                { href: "/tours", key: "tours" },
                { href: "/about", key: "about" },
                { href: "/contact", key: "contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary text-sm hover:text-emerald transition-colors duration-300">
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald mb-4">
              {t("popularTours")}
            </p>
            <ul className="space-y-2.5">
              {[
                { href: "/tours/caminata-selva", key: "jungleWalk" },
                { href: "/tours/caminata-nocturna", key: "nightWalk" },
                { href: "/tours/avistamiento-aves", key: "birdWatching" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary text-sm hover:text-emerald transition-colors duration-300">
                    {t(`tourLinks.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald mb-4">
              {t("contact")}
            </p>
            <ul className="space-y-2.5 text-text-secondary text-sm">
              <li>{t("location")}</li>
              <li>Costa Rica</li>
              <li>
                <a href="https://wa.me/50688888888" target="_blank" rel="noopener noreferrer" className="hover:text-emerald transition-colors duration-300">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-text-muted text-xs">
          <p>© {new Date().getFullYear()} Jungle Wildlife Tours. {t("legal")}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-emerald transition-colors duration-300">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-emerald transition-colors duration-300">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
