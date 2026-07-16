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

const SUPABASE_STORAGE_URL =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

function TourCard({
  tour,
  locale,
  variant,
  index,
}: {
  tour: Tour;
  locale: string;
  variant: "featured" | "side";
  index?: number;
}) {
  const tTours = useTranslations("tours");

  const images = tour.tour_images as {
    storage_path: string;
    is_cover: boolean;
    alt_text_es: string | null;
    alt_text_en: string | null;
  }[];
  const cover = images?.find((img) => img.is_cover) ?? images?.[0];
  const title = locale === "es" ? tour.title_es : tour.title_en;
  const desc =
    locale === "es" ? tour.short_description_es : tour.short_description_en;
  const alt = cover
    ? locale === "es"
      ? cover.alt_text_es
      : cover.alt_text_en
    : title;
  const durationH = Math.floor(tour.duration_minutes / 60);
  const durationM = tour.duration_minutes % 60;
  const categoryLabel = tTours(`categories.${tour.category}`);

  if (variant === "featured") {
    return (
        <Link href={`/tours/${tour.slug}`} className="group block md:col-span-2 md:row-span-2">
        <article className="relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-500 hover:border-emerald/40 hover:shadow-[0_0_48px_-12px_rgba(78,203,113,0.2)] h-full min-h-[420px] md:min-h-[500px]">
          <div className="absolute inset-0">
            {cover ? (
              <Image
                src={`${SUPABASE_STORAGE_URL}/${cover.storage_path}`}
                alt={alt ?? title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-surface">
                <Camera className="h-16 w-16 text-emerald/15" strokeWidth={1} aria-hidden="true" />
              </div>
            )}
            <div className="absolute inset-0 bg-surface" style={{ maskImage: 'linear-gradient(to top, black 0%, transparent 55%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 55%)' }} />
          </div>

          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 bg-bg/50 backdrop-blur-md border border-border/40 rounded-full text-text-secondary">
                <Clock className="h-3 w-3 opacity-50" strokeWidth={2} aria-hidden="true" />
                {durationH > 0 ? `${durationH}h` : ""}
                {durationM > 0 ? ` ${durationM}min` : ""}
              </span>
              <span className="inline-flex items-center font-display text-[9px] tracking-widest uppercase px-2.5 py-1 bg-emerald/10 backdrop-blur-md border border-emerald/20 rounded-full text-emerald">
                {categoryLabel}
              </span>
            </div>

            <h3 className="font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300 text-balance" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", lineHeight: 1.15 }}>
              {title}
            </h3>

            {desc && (
              <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2 max-w-md">
                {desc}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold text-sand" style={{ fontSize: "1.25rem" }}>
                  ${tour.price_usd}
                </span>
                <span className="font-mono text-text-secondary text-[10px] uppercase tracking-wider">USD</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-medium text-sm text-emerald transition-all duration-300 group-hover:gap-2.5">
                {tTours("viewTour")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/tours/${tour.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-500 hover:border-border-hover h-full">
        <div className="relative aspect-[16/10]">
          {cover ? (
            <Image
              src={`${SUPABASE_STORAGE_URL}/${cover.storage_path}`}
              alt={alt ?? title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-surface">
              <Camera className="h-10 w-10 text-emerald/15" strokeWidth={1} aria-hidden="true" />
            </div>
          )}
            <div className="absolute inset-0 bg-surface" style={{ maskImage: 'linear-gradient(to top, black 0%, transparent 50%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 50%)' }} />
          {index === 1 && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/[0.02] blur-3xl rounded-full pointer-events-none" aria-hidden="true" />
          )}
          {index === 2 && (
            <div className="absolute bottom-0 left-0 w-40 h-24 bg-sand/[0.015] blur-3xl rounded-full pointer-events-none" aria-hidden="true" />
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wider uppercase px-2 py-1 bg-bg/40 backdrop-blur-sm border border-border/30 rounded-full text-text-secondary">
              <Clock className="h-2.5 w-2.5 opacity-50" strokeWidth={2} aria-hidden="true" />
              {durationH > 0 ? `${durationH}h` : ""}
              {durationM > 0 ? ` ${durationM}min` : ""}
            </span>
            <span className="inline-flex items-center font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 bg-emerald/10 border border-emerald/15 rounded-full text-emerald">
              {categoryLabel}
            </span>
          </div>

          <h3 className="font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300 text-balance" style={{ fontSize: "1.1rem", lineHeight: 1.2 }}>
            {title}
          </h3>

          {desc && (
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed line-clamp-2">
              {desc}
            </p>
          )}

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-bold text-sand text-base">
                ${tour.price_usd}
              </span>
              <span className="font-mono text-text-secondary text-[9px] uppercase tracking-wider">USD</span>
            </div>
            <span className="inline-flex items-center gap-1 font-medium text-xs text-emerald transition-all duration-300 group-hover:gap-2">
              {tTours("viewTour")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function TourCardsSection({ tours, locale }: TourCardsSectionProps) {
  const tTours = useTranslations("tours");

  if (tours.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="tours-heading"
    >
      <Reveal delay={0}>
        <h2
          id="tours-heading"
          className="font-heading font-extrabold tracking-tight text-text text-balance"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
        >
          {tTours("title")}
        </h2>
      </Reveal>

      <Reveal delay={80}>
        <p className="mt-4 max-w-lg text-text-secondary text-[15px] leading-relaxed">
          {tTours("subtitle")}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 grid-cols-1 md:grid-cols-3 auto-rows-auto">
        {tours.length >= 1 && (
          <Reveal delay={160}>
            <TourCard tour={tours[0]} locale={locale} variant="featured" />
          </Reveal>
        )}

        {tours.slice(1, 3).map((tour, index) => (
          <Reveal key={tour.id} delay={240 + index * 80}>
            <TourCard tour={tour} locale={locale} variant="side" index={index} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={400}>
        <div className="mt-10 text-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald hover:text-emerald-bright transition-colors duration-300"
          >
            {tTours("viewDetails")}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
