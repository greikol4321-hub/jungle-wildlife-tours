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
    { key: "certifiedGuide", icon: ShieldCheck },
    { key: "legalRegistration", icon: BadgeCheck },
    { key: "localGuide", icon: Users },
    { key: "region", icon: MapPin },
  ] as const;

  return (
    <section className="border-t border-border bg-surface/50" aria-labelledby="trust-heading">

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Reveal>
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <h2
              id="trust-heading"
              className="font-display text-[11px] font-semibold tracking-[0.22em] uppercase text-emerald/70"
            >
              {tTrust("title")}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {items.map(({ key, icon: Icon }, index) => (
            <Reveal key={key} delay={80 + index * 60}>
              <div
                className="relative flex flex-col gap-4 p-5 md:p-7 rounded-2xl bg-surface border border-border transition-all duration-300 group hover:border-emerald/20 hover:bg-surface-elevated"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/10 ring-1 ring-emerald/20 transition-all duration-300 group-hover:bg-emerald/15">
                  <Icon className="h-5 w-5 text-emerald" strokeWidth={1.5} aria-hidden="true" />
                </div>

                {/* Label in Syne display font */}
                <p className="font-display text-[15px] md:text-base font-semibold text-text leading-snug tracking-[-0.01em]">
                  {tTrust(`badges.${key}`)}
                </p>

                {/* Subtle bottom corner accent */}
                <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-emerald/[0.02] blur-xl pointer-events-none" aria-hidden="true" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
