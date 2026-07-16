"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { Camera, Clock, ArrowRight } from "lucide-react";

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
    <section
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="tours-heading"
    >
      <Reveal delay={0}>
        <div className="section-divider mb-10">
          <div className="section-divider-line" />
          <div className="section-divider-dot" aria-hidden="true" />
          <div className="section-divider-line" />
        </div>
      </Reveal>

      <Reveal delay={100}>
        <h2
          id="tours-heading"
          className="text-center font-heading font-extrabold tracking-tight text-text"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          {tTours("title")}
        </h2>
      </Reveal>

      <Reveal delay={180}>
        <p className="mx-auto mt-5 max-w-lg text-center text-text-secondary text-sm leading-relaxed">
          {tTours("subtitle")}
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour, index) => {
          const images = tour.tour_images as {
            storage_path: string;
            is_cover: boolean;
            alt_text_es: string | null;
            alt_text_en: string | null;
          }[];
          const cover = images?.find((img) => img.is_cover) ?? images?.[0];
          const title = locale === "es" ? tour.title_es : tour.title_en;
          const desc =
            locale === "es"
              ? tour.short_description_es
              : tour.short_description_en;
          const alt = cover
            ? locale === "es"
              ? cover.alt_text_es
              : cover.alt_text_en
            : title;
          const durationH = Math.floor(tour.duration_minutes / 60);
          const durationM = tour.duration_minutes % 60;
          const categoryLabel = tTours(`categories.${tour.category}`);

          return (
            <Reveal key={tour.id} delay={220 + index * 100}>
              <Link
                href={`/tours/${tour.slug}`}
                className="group block"
              >
                <article
                  className="relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-border-hover hover:-translate-y-1"
                  style={{
                    boxShadow: "var(--shadow-card, 0 0 0 transparent)",
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {cover ? (
                      <Image
                        src={`${SUPABASE_STORAGE_URL}/${cover.storage_path}`}
                        alt={alt ?? title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-surface">
                        <Camera
                          className="h-12 w-12 text-emerald/20"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                    )}

                    {/* Bottom gradient overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Duration Badge — bottom-left pill */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 bg-bg/60 backdrop-blur-md border border-border/50 rounded-full text-text-secondary">
                        <Clock
                          className="h-3 w-3 opacity-60"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {durationH > 0 ? `${durationH}h` : ""}
                        {durationM > 0 ? ` ${durationM}min` : ""}
                      </span>
                    </div>

                    {/* Category Tag — top-right pill */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 bg-emerald/15 backdrop-blur-md border border-emerald/25 rounded-full text-emerald">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 pb-6">
                    <h3
                      className="font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300"
                      style={{
                        fontSize: "1.25rem",
                        letterSpacing: "-0.01em",
                        lineHeight: "1.3",
                      }}
                    >
                      {title}
                    </h3>

                    {desc && (
                      <p className="mt-2.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {desc}
                      </p>
                    )}

                    <div className="mt-4 border-t border-border pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span
                            className="font-heading font-bold text-sand"
                            style={{ fontSize: "1.15rem" }}
                          >
                            ${tour.price_usd}
                          </span>
                          <span className="font-mono font-normal text-text-secondary text-[10px] uppercase tracking-wider">
                            USD
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1.5 font-medium text-xs text-emerald transition-all duration-300 group-hover:gap-2.5">
                          {locale === "es" ? "Ver tour" : "View tour"}
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
