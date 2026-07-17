"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";

const sigils: Record<string, React.ReactNode> = {
  certifiedGuide: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L22 12L12 22L2 12Z" />
      <line x1="12" y1="7" x2="12" y2="17" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  ),
  legalRegistration: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="14" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
  localGuide: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3C12 3 6 9 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 9 12 3 12 3Z" />
    </svg>
  ),
  region: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="12" cy="12" r="2" />
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

export function TrustSection({ locale }: TrustSectionProps) {
  const tTrust = useTranslations("trust");

  const items = [
    { key: "certifiedGuide" as const },
    { key: "legalRegistration" as const },
    { key: "localGuide" as const },
    { key: "region" as const },
  ];

  return (
    <section className="relative border-t border-border" aria-labelledby="trust-heading">
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
