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

const FEATURES_ES = [
  "Guía especializado",
  "Equipo incluido",
  "2-3 horas",
  "Grupos pequeños",
];

const FEATURES_EN = [
  "Specialized guide",
  "Equipment included",
  "2-3 hours",
  "Small groups",
];

export function NightSection({ locale }: NightSectionProps) {
  const tTours = useTranslations("tours");
  const features = locale === "es" ? FEATURES_ES : FEATURES_EN;

  return (
    <section
      className="relative overflow-hidden bg-bg"
      aria-labelledby="night-heading"
      style={{
        background:
          "linear-gradient(160deg, #0B1A0F 0%, #060A07 40%, #0D0F08 100%)",
      }}
    >
      {/* Grid overlay — subtle */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(78,203,113,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(78,203,113,0.02)_1px,transparent_1px)] [background-size:60px_60px]" />
      </div>

      {/* Emerald radial glow — right side */}
      <div
        className="absolute right-[-80px] top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(78,203,113,0.06) 0%, rgba(78,203,113,0.02) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div>
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
                className="mt-3 font-heading font-bold tracking-tight text-text"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                  lineHeight: 1.1,
                  textShadow: "0 2px 24px rgba(0,0,0,0.4)",
                }}
              >
                {locale === "es"
                  ? "La selva también se vive de noche"
                  : "The jungle comes alive at night"}
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-6 text-[17px] font-light text-text-secondary leading-[1.85] max-w-lg">
                {locale === "es"
                  ? "La caminata nocturna te muestra una faceta de Manuel Antonio que pocos ven: anfibios, insectos, mamíferos y la actividad que solo ocurre bajo la oscuridad del dosel."
                  : "The night walk reveals a side of Manuel Antonio few see: amphibians, insects, mammals, and the activity that only happens under the canopy of darkness."}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <ul className="mt-7 space-y-3">
                {features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2.5 text-[15px] text-text/80"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald/70" />
                    {feat}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tours/caminata-nocturna"
                  className="btn btn-primary"
                >
                  {locale === "es" ? "Más información" : "Learn more"}
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

          {/* Visual Column — Floating Circle */}
          <Reveal delay={200}>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[380px] h-[380px] max-w-full">
                {/* Outermost ring — rotation */}
                <div
                  className="absolute inset-[-12px] rounded-full animate-night-ring-spin"
                  aria-hidden="true"
                  style={{
                    border: "1px solid rgba(78,203,113,0.07)",
                  }}
                />

                {/* Glow ring */}
                <div
                  className="absolute inset-[-6px] rounded-full"
                  aria-hidden="true"
                  style={{
                    boxShadow:
                      "0 0 40px rgba(78,203,113,0.08), inset 0 0 30px rgba(78,203,113,0.03)",
                    border: "1px solid rgba(78,203,113,0.06)",
                  }}
                />

                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full p-3 night-circle-outer animate-float-slow" aria-hidden="true">
                  {/* Middle ring */}
                  <div className="absolute inset-1 rounded-full night-circle-middle" />
                  {/* Inner content */}
                  <div className="relative h-full w-full rounded-full overflow-hidden night-circle-inner">
                    <Image
                      src={`${SUPABASE_STORAGE_URL}/wildlife-sloth-01.jpg`}
                      alt={
                        locale === "es"
                          ? "Fauna nocturna en la selva de Manuel Antonio"
                          : "Nocturnal wildlife in Manuel Antonio jungle"
                      }
                      fill
                      sizes="380px"
                      className="object-cover image-zoom"
                    />
                    {/* Inner vignette */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Floating particles — 6 total */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                >
                  {/* emerald — 2px */}
                  <div
                    className="absolute top-[18%] left-[22%] h-[2px] w-[2px] rounded-full bg-emerald/40 animate-pulse-slow"
                    style={{ animationDelay: "0s" }}
                  />
                  {/* sand — 1.5px */}
                  <div
                    className="absolute top-[32%] right-[18%] h-[1.5px] w-[1.5px] rounded-full bg-sand/40 animate-pulse-slow"
                    style={{ animationDelay: "0.7s" }}
                  />
                  {/* emerald — 1px */}
                  <div
                    className="absolute bottom-[38%] left-[16%] h-px w-px rounded-full bg-emerald/30 animate-pulse-slow"
                    style={{ animationDelay: "1.4s" }}
                  />
                  {/* sand — 2px */}
                  <div
                    className="absolute bottom-[22%] right-[24%] h-[2px] w-[2px] rounded-full bg-sand/30 animate-pulse-slow"
                    style={{ animationDelay: "2s" }}
                  />
                  {/* emerald — 1.5px */}
                  <div
                    className="absolute top-[55%] right-[8%] h-[1.5px] w-[1.5px] rounded-full bg-emerald/25 animate-pulse-slow"
                    style={{ animationDelay: "2.8s" }}
                  />
                  {/* sand — 1px */}
                  <div
                    className="absolute top-[8%] right-[42%] h-px w-px rounded-full bg-sand/25 animate-pulse-slow"
                    style={{ animationDelay: "3.5s" }}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
