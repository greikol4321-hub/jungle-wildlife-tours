"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";

interface TrustSectionProps {
  locale: string;
}

export function TrustSection({ locale }: TrustSectionProps) {
  const tTrust = useTranslations("trust");

  const badges = [
    { key: "certifiedGuide", icon: "shield-check" },
    { key: "legalRegistration", icon: "badge-check" },
    { key: "localGuide", icon: "users" },
    { key: "region", icon: "map-pin" },
  ] as const;

  return (
    <section className="border-y border-border py-24" aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">
        {tTrust("title") || "Confianza y certificaciones"}
      </h2>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {badges.map(({ key, icon }, index) => (
            <Reveal key={key} delay={100 + index * 100}>
              <div className="trust-badge group">
                <div className="trust-badge-icon">
                  {icon === "shield-check" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {icon === "badge-check" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {icon === "users" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {icon === "map-pin" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
                <p className="trust-badge-label">{tTrust(`badges.${key}`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}