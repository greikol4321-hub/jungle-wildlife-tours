"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";

const sigils: Record<string, React.ReactNode> = {
  certifiedGuide: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 16l2 -6l6 -2l-2 6l-6 2" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 3l0 2" />
      <path d="M12 19l0 2" />
      <path d="M3 12l2 0" />
      <path d="M19 12l2 0" />
    </svg>
  ),
  legalRegistration: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M9 15l2 2l4 -4" />
    </svg>
  ),
  localGuide: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 21c.5 -4.5 2.5 -8 7 -10" />
      <path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z" />
    </svg>
  ),
  region: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
    </svg>
  ),
};

const subtitles: Record<string, [string, string]> = {
  certifiedGuide: ["ICT·SEGURIDAD", "ICT·SAFETY"],
  legalRegistration: ["HÁGALO LEGAL", "FULLY LEGAL"],
  localGuide: ["NATURALEZA VIVA", "LIVE NATURE"],
  region: ["PURA VIDA", "PURA VIDA"],
};

interface TrustSectionProps {
  locale: string;
}

const items = [
  { key: "certifiedGuide" as const },
  { key: "legalRegistration" as const },
  { key: "localGuide" as const },
  { key: "region" as const },
];

export function TrustSection({ locale }: TrustSectionProps) {
  const tTrust = useTranslations("trust");

  return (
    <section className="relative border-t border-border paw-pattern" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <Reveal delay={80}>
          <div className="flex items-center gap-3 mb-12 md:mb-16" aria-hidden="true">
            <div className="h-px w-12 bg-gradient-to-r from-emerald/30 to-transparent" />
            <div className="h-1.5 w-1.5 bg-emerald/40" />
            <div className="h-px flex-1 bg-gradient-to-r from-emerald/20 to-transparent" />
          </div>
        </Reveal>

        <div className="grid grid-cols-2">
          {items.map(({ key }, index) => {
            const sub = subtitles[key];
            return (
              <Reveal key={key} delay={80 + index * 60}>
                <div
                  className={`h-full p-6 md:p-10 ${
                    index < 2 ? "border-b border-border" : ""
                  } ${
                    index === 0 || index === 2 ? "border-r border-border" : ""
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center text-emerald">
                    {sigils[key]}
                  </span>

                  <p className="mt-5 font-mono text-[11px] leading-[1.6] tracking-[0.12em] text-text">
                    {tTrust(`badges.${key}`)}
                  </p>
                  <p className="mt-2 font-mono text-[8px] tracking-[0.2em] text-text-muted uppercase">
                    — {sub[locale === "es" ? 0 : 1]}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
