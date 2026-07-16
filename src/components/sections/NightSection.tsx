"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";

const SUPABASE_STORAGE_URL =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

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
      style={{
        background: "linear-gradient(170deg, #0B1A0F 0%, #060D08 50%, #0B1A0F 100%)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Content — 2 cols */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald" />
                <p className="font-mono text-[11px] font-medium tracking-[0.22em] text-emerald uppercase">
                  {tTours("categories.night_walk")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2
                id="night-heading"
                className="mt-4 font-heading font-bold tracking-tight text-text text-balance"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                  lineHeight: 1.1,
                }}
              >
                {tNight("heading")}
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-5 text-[15px] font-light text-text-secondary leading-[1.85] max-w-sm">
                {tNight("description")}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <ul className="mt-6 space-y-2.5">
                {features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2.5 text-sm text-text/80"
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

          {/* Image — 3 cols, editorial rectangular frame */}
          <Reveal delay={200} className="lg:col-span-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/50">
              <Image
                src={`${SUPABASE_STORAGE_URL}/wildlife-sloth-01.jpg`}
                alt={tNight("imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
              {/* Vignette overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-bg/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent pointer-events-none" />

              {/* Corner accent line */}
              <div className="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-emerald/40 to-transparent" />
              <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-emerald/20 to-transparent" />

              {/* Subtle glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background: "radial-gradient(ellipse 40% 40% at 30% 70%, rgba(78,203,113,0.06) 0%, transparent 70%)",
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
