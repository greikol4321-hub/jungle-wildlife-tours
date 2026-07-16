"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { ShieldCheck, BadgeCheck, Users, MapPin } from "lucide-react";

interface TrustSectionProps {
  locale: string;
}

export function TrustSection(_props: TrustSectionProps) {
  const tTrust = useTranslations("trust");

  const items = [
    { key: "certifiedGuide", icon: ShieldCheck, accent: true },
    { key: "legalRegistration", icon: BadgeCheck, accent: false },
    { key: "localGuide", icon: Users, accent: false },
    { key: "region", icon: MapPin, accent: false },
  ] as const;

  return (
    <section className="border-y border-border bg-surface/50" aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">
        {tTrust("title")}
      </h2>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-border">
          {items.map(({ key, icon: Icon, accent }, index) => (
            <Reveal key={key} delay={80 + index * 80}>
              <div
                className={`flex items-center gap-4 py-6 md:py-8 px-6 md:px-10 transition-colors duration-300 group ${
                  accent
                    ? "md:flex-[1.25] bg-emerald/[0.025]"
                    : "md:flex-1 hover:bg-white/[0.012]"
                }`}
              >
                <div
                  className={`flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                    accent
                      ? "bg-emerald/10 group-hover:bg-emerald/15 ring-1 ring-emerald/20"
                      : "bg-white/[0.03] group-hover:bg-white/[0.06] ring-1 ring-border"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${accent ? "text-emerald" : "text-sand/70"}`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <p
                  className={`text-[13px] font-medium leading-snug ${accent ? "text-text" : "text-text-secondary"}`}
                >
                  {tTrust(`badges.${key}`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
