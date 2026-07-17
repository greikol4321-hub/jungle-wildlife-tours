"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { SUPABASE_STORAGE_URL } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

interface NightSectionProps {
  locale: string;
}

export function NightSection({ locale }: NightSectionProps) {
  const tTours = useTranslations("tours");
  const tNight = useTranslations("night");
  const features = [
    tNight("featureGuide"),
    tNight("featureEquipment"),
    tNight("featureDuration"),
    tNight("featureGroups"),
  ];

  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="night-heading"
    >
      {/* Dark background with subtle canopy texture */}
      <div className="absolute inset-0">
        <Image
          src={`${SUPABASE_STORAGE_URL}/jungle-canopy-01.jpg`}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060D08] via-[#0B1A0F] to-[#060D08]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Content — 2 cols */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald" />
                <p className="font-display text-[11px] font-medium tracking-[0.22em] text-emerald uppercase">
                  {tTours("categories.night_walk")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2
                id="night-heading"
                className="mt-4 font-heading font-bold tracking-tight text-text text-balance"
                style={{
                  fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                  lineHeight: 1.1,
                }}
              >
                {tNight("heading")}
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-5 text-[14px] md:text-[16px] font-light text-text-secondary leading-[1.85] max-w-sm">
                {tNight("description")}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <ul className="mt-6 space-y-2.5">
                {features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2.5 text-sm md:text-[15px] text-text/80"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald/60 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tours/caminata-nocturna"
                  className="btn btn-primary"
                >
                  {tNight("learnMore")}
                </Link>
                <a
                  href="https://wa.me/50688888888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  {tTours("book")}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Visual — 3 cols, no photo, atmospheric dark panel */}
          <Reveal delay={200} className="lg:col-span-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.04] bg-gradient-to-br from-white/[0.02] to-transparent">
              {/* Inner glow accents */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 50% at 30% 60%, rgba(78,203,113,0.06) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse 40% 40% at 70% 30%, rgba(78,203,113,0.03) 0%, transparent 60%)",
                }}
              />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-emerald/10 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-emerald/30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                  </div>
                  <p className="font-display text-[10px] tracking-[0.2em] uppercase text-text-secondary/40">
                    {tTours("categories.night_walk")}
                  </p>
                </div>
              </div>

              {/* Corner accent lines */}
              <div className="absolute bottom-0 left-0 w-20 h-px bg-gradient-to-r from-emerald/20 to-transparent" />
              <div className="absolute top-0 right-0 w-14 h-px bg-gradient-to-l from-emerald/10 to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
