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
    <section className="relative border-t border-border bg-surface/50" aria-labelledby="trust-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[60vw] opacity-[0.03]"
          style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(78,203,113,1) 0%, transparent 70%)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <Reveal delay={80}>
          <div className="flex items-center gap-3 mb-10 md:mb-12" aria-hidden="true">
            <div className="h-px w-12 bg-gradient-to-r from-emerald/30 to-transparent" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald/40" />
            <div className="h-px flex-1 bg-gradient-to-r from-emerald/20 to-transparent" />
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {items.map(({ key, icon: Icon }, index) => (
            <Reveal key={key} delay={80 + index * 60}>
              <div className="group relative rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-emerald/20 hover:shadow-[0_0_40px_-12px_rgba(78,203,113,0.15)]">
                {/* Top accent bar */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

                <div className="p-5 md:p-7 flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10 ring-1 ring-emerald/15 transition-all duration-300 group-hover:bg-emerald/15 group-hover:ring-emerald/25">
                    <Icon className="h-5 w-5 text-emerald" strokeWidth={1.5} aria-hidden="true" />
                  </div>

                  <p className="font-display text-[15px] md:text-base font-semibold text-text leading-snug tracking-[-0.01em]">
                    {tTrust(`badges.${key}`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
