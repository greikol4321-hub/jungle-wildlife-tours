"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Clock, Camera, ArrowRight } from "lucide-react";

interface TourImage {
  storage_path: string;
  is_cover: boolean;
  alt_text_es: string | null;
  alt_text_en: string | null;
}

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
  tour_images: TourImage[];
}

interface TourCardProps {
  tour: Tour;
  locale: string;
  index: number;
  featured?: boolean;
}

const SUPABASE_URL =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

export function TourCard({ tour, locale, index, featured }: TourCardProps) {
  const tTours = useTranslations("tours");
  const reduce = useReducedMotion();

  const images = tour.tour_images as TourImage[];
  const cover = images?.find((img) => img.is_cover) ?? images?.[0];
  const title = locale === "es" ? tour.title_es : tour.title_en;
  const desc = locale === "es" ? tour.short_description_es : tour.short_description_en;
  const alt = cover
    ? locale === "es" ? cover.alt_text_es : cover.alt_text_en
    : title;
  const durationH = Math.floor(tour.duration_minutes / 60);
  const durationM = tour.duration_minutes % 60;
  const categoryLabel = tTours(`categories.${tour.category}`);

  const categoryColors: Record<string, string> = {
    day_park: "from-emerald/15 to-emerald/5 text-emerald border-emerald/20",
    mangrove: "from-cyan/15 to-cyan/5 text-cyan border-cyan/20",
    night_walk: "from-purple/15 to-purple/5 text-purple border-purple/20",
  };
  const catColor = categoryColors[tour.category] ?? "from-emerald/15 to-emerald/5 text-emerald border-emerald/20";
  const radius = "clamp(1rem, 2vw, 1.75rem)";

  const cardBody = (
    <>
      {/* Outer shell */}
      <div
        className="absolute inset-0 border transition-all duration-500"
        style={{
          borderRadius: radius,
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
          boxShadow: "0 4px 24px -8px rgba(0,0,0,0.3)",
        }}
      />

      {/* Inner core */}
      <div
        className="relative z-[1] m-[1px] overflow-hidden transition-all duration-500"
        style={{
          borderRadius: `calc(${radius} - 1px)`,
          background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%)",
        }}
      >
        {featured ? (
          <>
            {/* Full-bleed image overlay */}
            <div className="absolute inset-0">
              {cover ? (
                <Image
                  src={`${SUPABASE_URL}/${cover.storage_path}`}
                  alt={alt ?? title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-surface">
                  <Camera className="h-16 w-16 text-emerald/15" strokeWidth={1} aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/30 to-transparent" aria-hidden="true" />
            </div>

            {/* Hover shine */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[2]"
              aria-hidden="true"
              style={{ background: "linear-gradient(135deg, rgba(78,203,113,0.1) 0%, transparent 50%)" }}
            />

            {/* Badges */}
            <div className="absolute top-4 right-4 z-10">
              <span className={`inline-flex items-center font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-gradient-to-br ${catColor} backdrop-blur-md`}>
                {categoryLabel}
              </span>
            </div>
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 bg-bg/60 backdrop-blur-md border border-border/40 rounded-full text-text-secondary">
                <Clock className="h-3 w-3 opacity-60" strokeWidth={2} aria-hidden="true" />
                {durationH > 0 ? `${durationH}h` : ""}{durationM > 0 ? ` ${durationM}min` : ""}
              </span>
            </div>

            {/* Content overlay */}
            <div className="relative z-[1] flex flex-col justify-end h-full p-6 md:p-8">
              <h3
                className="font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300 text-balance"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", lineHeight: 1.1 }}
              >
                {title}
              </h3>
              {desc && (
                <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2 max-w-lg">
                  {desc}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between max-w-sm">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-bold text-sand" style={{ fontSize: "1.35rem" }}>
                    ${tour.price_usd}
                  </span>
                  <span className="font-mono text-text-secondary text-[9px] uppercase tracking-wider">USD</span>
                </div>
                <span className="inline-flex items-center gap-2 font-medium text-xs text-emerald transition-all duration-300 group-hover:gap-3">
                  {tTours("viewTour")}
                  <span className="w-7 h-7 rounded-full bg-emerald/10 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald/20 group-hover:scale-110">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-[16/10] overflow-hidden">
              {cover ? (
                <Image
                  src={`${SUPABASE_URL}/${cover.storage_path}`}
                  alt={alt ?? title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  loading={index < 3 ? "eager" : "lazy"}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-surface">
                  <Camera className="h-12 w-12 text-emerald/15" strokeWidth={1} aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent" aria-hidden="true" />
              <div className="absolute top-3 right-3 z-10">
                <span className={`inline-flex items-center font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-gradient-to-br ${catColor} backdrop-blur-sm`}>
                  {categoryLabel}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 bg-bg/60 backdrop-blur-md border border-border/40 rounded-full text-text-secondary">
                  <Clock className="h-3 w-3 opacity-60" strokeWidth={2} aria-hidden="true" />
                  {durationH > 0 ? `${durationH}h` : ""}{durationM > 0 ? ` ${durationM}min` : ""}
                </span>
              </div>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                aria-hidden="true"
                style={{ background: "linear-gradient(135deg, rgba(78,203,113,0.08) 0%, transparent 50%)" }}
              />
            </div>

            <div className="p-5">
              <h3
                className="font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300 text-balance"
                style={{ fontSize: "1.1rem", lineHeight: 1.2 }}
              >
                {title}
              </h3>
              {desc && (
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {desc}
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-bold text-sand text-base">${tour.price_usd}</span>
                  <span className="font-mono text-text-secondary text-[9px] uppercase tracking-wider">USD</span>
                </div>
                <span className="inline-flex items-center gap-2 font-medium text-xs text-emerald transition-all duration-300 group-hover:gap-3">
                  {tTours("viewTour")}
                  <span className="w-7 h-7 rounded-full bg-emerald/10 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald/20 group-hover:scale-110">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`h-full ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <Link
        href={`/tours/${tour.slug}`}
        className={`group block h-full ${featured ? "min-h-[420px] md:min-h-[520px]" : ""}`}
      >
        <article className="relative h-full overflow-hidden" style={{ borderRadius: radius }}>
          {cardBody}
        </article>
      </Link>
    </motion.div>
  );
}
