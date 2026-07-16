"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";

const SUPABASE_STORAGE_URL =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

interface NightSectionProps {
  locale: string;
}

export function NightSection({ locale }: NightSectionProps) {
  const tTours = useTranslations("tours");

  return (
    <section
      className="relative overflow-hidden bg-bg"
      aria-labelledby="night-heading"
      style={{ background: "linear-gradient(160deg, #0B1A0F 0%, #080C08 40%, #0D0F08 100%)" }}
    >
      {/* Grid overlay with mask */}
      <div className="absolute inset-0 night-grid-mask">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(78,203,113,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(78,203,113,0.025)_1px,transparent_1px)] [background-size:60px_60px]" />
      </div>

      {/* Ambient glow */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(78,203,113,0.05)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div>
            <Reveal>
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-emerald uppercase">
                {tTours("categories.night_walk")}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h2 id="night-heading" className="mt-2 font-heading font-bold tracking-tight text-text" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}>
                {locale === "es"
                  ? "La selva también se vive de noche"
                  : "The jungle comes alive at night"}
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-5 text-base font-light text-text-secondary leading-[1.85] max-w-lg">
                {locale === "es"
                  ? "La caminata nocturna te muestra una faceta de Manuel Antonio que pocos ven: anfibios, insectos, mamíferos y la actividad que solo ocurre bajo la oscuridad del dosel."
                  : "The night walk reveals a side of Manuel Antonio few see: amphibians, insects, mammals, and the activity that only happens under the canopy of darkness."}
              </p>
            </Reveal>

            <Reveal delay={260}>
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

          {/* Visual Column - Floating Circle */}
          <Reveal delay={200}>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[340px] h-[340px] max-w-full">
                {/* Outer ring - double bezel */}
                <div className="absolute inset-0 rounded-full p-3 night-circle-outer animate-float-slow" aria-hidden="true">
                  {/* Middle ring */}
                  <div className="absolute inset-1 rounded-full night-circle-middle" />
                  {/* Inner content */}
                  <div className="relative h-full w-full rounded-full overflow-hidden night-circle-inner">
                    <Image
                      src={`${SUPABASE_STORAGE_URL}/wildlife-sloth-01.jpg`}
                      alt={locale === "es" ? "Fauna nocturna en la selva de Manuel Antonio" : "Nocturnal wildlife in Manuel Antonio jungle"}
                      fill
                      sizes="340px"
                      className="object-cover image-zoom"
                    />
                    {/* Inner vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-emerald/30 animate-pulse-slow" style={{ animationDelay: "0s" }} />
                  <div className="absolute top-1/3 right-1/5 w-1 h-1 rounded-full bg-sand/40 animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute bottom-1/3 left-1/5 w-1 h-1 rounded-full bg-emerald/30 animate-pulse-slow" style={{ animationDelay: "1s" }} />
                  <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-sand/30 animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
