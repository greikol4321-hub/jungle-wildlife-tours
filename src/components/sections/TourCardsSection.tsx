"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

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
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="tours-heading">
      {/* Section Divider */}
      <Reveal delay={0}>
        <div className="section-divider mb-12">
          <div className="h-px flex-1 bg-border" />
          <div className="h-3 w-3 rounded-full border-2 border-emerald flex-shrink-0" aria-hidden="true" />
          <div className="h-px flex-1 bg-border" />
        </div>
      </Reveal>

      <Reveal delay={100}>
        <h2 id="tours-heading" className="text-center font-heading font-bold tracking-tight text-white" style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)" }}>
          {tTours("title")}
        </h2>
      </Reveal>

      <Reveal delay={180}>
        <p className="mx-auto mt-4 max-w-xl text-center text-text-secondary">
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
          const categoryLabel = tTours(`categories.${tour.category}`);

          return (
            <Reveal key={tour.id} delay={220 + index * 100}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Link
                  href={`/tours/${tour.slug}`}
                  className="group block relative overflow-hidden rounded-2xl border border-gold/15 bg-surface transition-all duration-500 hover:border-gold/40 hover:shadow-[0_20px_60px_-15px_rgba(232,196,94,0.12)]"
                >
                  {/* Image — 16:9 film frame */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {cover ? (
                      <Image
                        src={`${SUPABASE_STORAGE_URL}/${cover.storage_path}`}
                        alt={alt ?? title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald/20 to-surface">
                        <svg className="h-14 w-14 text-emerald/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    )}

                    {/* Inner vignette — film feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

                    {/* Top-left warm glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" aria-hidden="true">
                      <div className="absolute inset-0 [background:radial-gradient(circle_at_20%_20%,rgba(232,196,94,0.08)_0%,transparent_60%)]" />
                    </div>

                    {/* Duration Badge */}
                    <span className="absolute bottom-3 left-3 z-10 font-mono text-[11px] tracking-[0.1em] uppercase px-2.5 py-1 bg-bg/80 backdrop-blur-sm border border-border rounded-full text-text-secondary">
                      {durationH > 0 ? `${durationH}h` : ""}
                      {durationM > 0 ? ` ${durationM}min` : ""}
                    </span>

                    {/* Category Tag */}
                    <span className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-widest uppercase px-2 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold">
                      {categoryLabel}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-white group-hover:text-gold transition-colors duration-300" style={{ fontSize: "1.25rem", letterSpacing: "-0.01em" }}>
                      {title}
                    </h3>

                    {desc && (
                      <p className="mt-2.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {desc}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                      <span className="font-heading font-bold text-gold" style={{ fontSize: "1.1rem" }}>
                        ${tour.price_usd}
                        <span className="font-mono font-normal text-text-secondary/60 text-xs ml-1">USD</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 font-medium text-sm text-emerald transition-all duration-300 group-hover:gap-2.5 group-hover:text-emerald">
                        {locale === "es" ? "Ver tour" : "View tour"}
                        <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
