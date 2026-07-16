"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";

interface Tour {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  short_description_es: string | null;
  short_description_en: string | null;
  duration_minutes: number;
  price_usd: number;
  category: string;
  tour_images: {
    storage_path: string;
    is_cover: boolean;
    alt_text_es: string | null;
    alt_text_en: string | null;
  }[];
}

interface TourCardsSectionProps {
  tours: Tour[];
  locale: string;
}

export function TourCardsSection({ tours, locale }: TourCardsSectionProps) {
  const tTours = useTranslations("tours");
  const SUPABASE_STORAGE_URL =
    "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

  if (tours.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8" aria-labelledby="tours-heading">
      <Reveal delay={0}>
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-border" />
          <div className="h-3 w-3 rounded-full border-2 border-green" />
          <div className="h-px flex-1 bg-border" />
        </div>
      </Reveal>
      <Reveal delay={100}>
        <h2 id="tours-heading" className="text-center font-heading font-bold tracking-tight text-white" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}>
          {tTours("title")}
        </h2>
      </Reveal>
      <Reveal delay={200}>
        <p className="mx-auto mt-3 max-w-xl text-center text-text-secondary">
          {tTours("subtitle")}
        </p>
      </Reveal>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour, index) => {
          const images = tour.tour_images as {
            storage_path: string;
            is_cover: boolean;
            alt_text_es: string | null;
            alt_text_en: string | null;
          }[];
          const cover = images?.find((img) => img.is_cover) ?? images?.[0];
          const title = locale === "es" ? tour.title_es : tour.title_en;
          const desc = locale === "es" ? tour.short_description_es : tour.short_description_en;
          const alt = cover ? (locale === "es" ? cover.alt_text_es : cover.alt_text_en) : title;
          const durationH = Math.floor(tour.duration_minutes / 60);
          const durationM = tour.duration_minutes % 60;

          return (
            <Reveal key={tour.id} delay={200 + index * 100}>
              <Link
                href={`/tours/${tour.slug}`}
                className="group relative p-2.5 border border-border rounded-[20px] transition duration-400 ease-out hover:border-border-hover hover:-translate-y-1 active:scale-[0.985]"
              >
                <div className="relative rounded-[17.5px] bg-surface overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <div className="relative h-52 overflow-hidden">
                    {cover ? (
                      <Image
                        src={`${SUPABASE_STORAGE_URL}/${cover.storage_path}`}
                        alt={alt ?? title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-600 ease-out group-hover:scale-106"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green to-canopy-950">
                        <svg className="h-12 w-12 text-moss-200/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-3 z-10 font-mono text-[0.55rem] tracking-[0.1em] uppercase px-2 py-1 bg-bg/70 backdrop-blur-sm border border-border rounded-full text-text-secondary">
                      {durationH > 0 ? `${durationH}h` : ""}
                      {durationM > 0 ? ` ${durationM}min` : ""}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-green">
                      {tTours(`categories.${tour.category}`)}
                    </p>
                    <h3 className="mt-1 font-heading font-bold text-white group-hover:text-green transition-colors" style={{ fontSize: "1.3rem", letterSpacing: "-0.01em" }}>
                      {title}
                    </h3>
                    {desc && (
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {desc}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <span className="font-heading font-bold text-gold" style={{ fontSize: "1.05rem" }}>
                        Desde ${tour.price_usd}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-sm text-green transition-colors group-hover:gap-2">
                        {locale === "es" ? "Ver más" : "Learn more"}
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}