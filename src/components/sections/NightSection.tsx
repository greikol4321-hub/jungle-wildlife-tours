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
    <section className="relative overflow-hidden bg-[linear-gradient(160deg,#0A1A0E_0%,#060A06_40%,#0D0F08_100%)]" aria-labelledby="night-heading">
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_50%_70%_at_70%_50%,black_0%,transparent_70%)]">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(184,217,53,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(184,217,53,0.025)_1px,transparent_1px)] [background-size:60px_60px]" />
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(184,217,53,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-lime uppercase">
                {tTours("categories.night_walk")}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 id="night-heading" className="mt-1 font-heading font-bold tracking-tight text-white" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>
                {locale === "es"
                  ? "La selva también se vive de noche"
                  : "The jungle comes alive at night"}
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 text-base font-light text-text-secondary leading-[1.85]">
                {locale === "es"
                  ? "La caminata nocturna te muestra una faceta de Manuel Antonio que pocos ven: anfibios, insectos, mamíferos y la actividad que solo ocurre bajo la oscuridad del dosel."
                  : "The night walk reveals a side of Manuel Antonio few see: amphibians, insects, mammals, and the activity that only happens under the canopy of darkness."}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tours/caminata-nocturna"
                  className="inline-flex items-center justify-center rounded-full bg-lime px-8 py-3.5 text-sm font-semibold text-bg shadow-sm transition hover:opacity-90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
                >
                  {locale === "es" ? "Más información" : "Learn more"}
                </Link>
                <a
                  href="https://wa.me/50688888888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3.5 text-sm font-semibold text-text transition hover:border-border-hover active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {tTours("book")}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="flex justify-center lg:justify-end">
              <div className="relative h-[320px] w-[320px] max-w-full">
                <div className="absolute inset-0 rounded-full p-3 bg-lime/10 border border-lime/10 shadow-[0_0_80px_rgba(184,217,53,0.05),inset_0_1px_0_rgba(255,255,255,0.03)] animate-float">
                  <div className="relative h-full w-full rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                    <Image
                      src={`${SUPABASE_STORAGE_URL}/wildlife-sloth-01.jpg`}
                      alt={locale === "es" ? "Fauna nocturna en la selva de Manuel Antonio" : "Nocturnal wildlife in Manuel Antonio jungle"}
                      fill
                      sizes="320px"
                      className="object-cover transition duration-600 ease-out group-hover:scale-108"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}