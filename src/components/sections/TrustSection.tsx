"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { ShieldCheck, BadgeCheck, Users, MapPin } from "lucide-react";

interface TrustSectionProps {
  locale: string;
}

export function TrustSection(_props: TrustSectionProps) {
  const tTrust = useTranslations("trust");

  const badges = [
    { key: "certifiedGuide", icon: "shield-check" },
    { key: "legalRegistration", icon: "badge-check" },
    { key: "localGuide", icon: "users" },
    { key: "region", icon: "map-pin" },
  ] as const;

  const iconMap = { "shield-check": ShieldCheck, "badge-check": BadgeCheck, "users": Users, "map-pin": MapPin } as const;

  return (
    <section className="border-y border-border py-24 bg-surface" aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">
        {tTrust("title") || "Confianza y certificaciones"}
      </h2>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Divider */}
        <Reveal delay={0}>
          <div className="section-divider mb-10">
            <div className="section-divider-line" />
            <div className="section-divider-dot" aria-hidden="true" />
            <div className="section-divider-line" />
          </div>
        </Reveal>

        <Reveal delay={50}>
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-emerald text-center mb-12">
            {tTrust("title") || "Confianza y certificaciones"}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {badges.map(({ key, icon }, index) => (
            <Reveal key={key} delay={100 + index * 100}>
              <div className="trust-badge group">
                <div className="trust-badge-icon">
                  {(() => { const Icon = iconMap[icon]; return <Icon strokeWidth={1.5} aria-hidden="true" />; })()}
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
