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
    mangrove: "from-sky/15 to-sky/5 text-sky border-sky/20",
    night_walk: "from-purple/15 to-purple/5 text-purple border-purple/20",
  };
  const catColor = categoryColors[tour.category] ?? "from-emerald/15 to-emerald/5 text-emerald border-emerald/20";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={featured ? "md:col-span-2 md:row-span-2" : ""}
    >
      <Link href={`/tours/${tour.slug}`} className="group block h-full">
        <article
          className="relative h-full overflow-hidden"
          style={{ borderRadius: "clamp(1rem, 2vw, 1.75rem)" }}
        >
          {/* Outer shell (double-bezel) */}
          <div className="absolute inset-0 bg-surface border border-border transition-all duration-500"
            style={{
              borderRadius: "clamp(1rem, 2vw, 1.75rem)",
              boxShadow: "0 4px 24px -8px rgba(0,0,0,0.3)",
            }}
          />

          {/* Inner core */}
          <div className="relative z-[1] m-[1px] overflow-hidden bg-gradient-to-br from-surface/80 to-bg/80 transition-all duration-500 group-hover:from-surface/60 group-hover:to-bg/60"
            style={{ borderRadius: "calc(clamp(1rem, 2vw, 1.75rem) - 1px)" }}
          >
            {/* Image */}
            <div className={`relative overflow-hidden ${featured ? "aspect-[16/10] md:aspect-[16/9]" : "aspect-[16/10]"}`}>
              {cover ? (
                <Image
                  src={`${SUPABASE_URL}/${cover.storage_path}`}
                  alt={alt ?? title}
                  fill
                  sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 40vw"}
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-surface">
                  <Camera className="h-12 w-12 text-emerald/15" strokeWidth={1} aria-hidden="true" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-bg/5" aria-hidden="true" />

              {/* Category badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`inline-flex items-center font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-gradient-to-br ${catColor} backdrop-blur-sm`}>
                  {categoryLabel}
                </span>
              </div>

              {/* Duration */}
              <div className="absolute bottom-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 bg-bg/60 backdrop-blur-md border border-border/40 rounded-full text-text-secondary">
                  <Clock className="h-3 w-3 opacity-60" strokeWidth={2} aria-hidden="true" />
                  {durationH > 0 ? `${durationH}h` : ""}{durationM > 0 ? ` ${durationM}min` : ""}
                </span>
              </div>

              {/* Hover shine */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                aria-hidden="true"
                style={{
                  background: "linear-gradient(135deg, rgba(78,203,113,0.08) 0%, transparent 50%)",
                }}
              />
            </div>

            {/* Content */}
            <div className={`${featured ? "p-6 md:p-8" : "p-5"}`}>
              <h3
                className="font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300 text-balance"
                style={{
                  fontSize: featured ? "clamp(1.3rem, 2.5vw, 1.7rem)" : "1.1rem",
                  lineHeight: 1.15,
                }}
              >
                {title}
              </h3>

              {desc && (
                <p className={`mt-2 text-text-secondary leading-relaxed line-clamp-2 ${featured ? "text-sm" : "text-xs"}`}>
                  {desc}
                </p>
              )}

              {/* Price + CTA */}
              <div className={`mt-4 flex items-center justify-between ${featured ? "pt-4" : "pt-3"} border-t border-border`}>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-bold text-sand" style={{ fontSize: featured ? "1.3rem" : "1.1rem" }}>
                    ${tour.price_usd}
                  </span>
                  <span className="font-mono text-text-secondary text-[9px] uppercase tracking-wider">USD</span>
                </div>

                {/* Button-in-button pattern */}
                <span className="inline-flex items-center gap-2 font-medium text-xs text-emerald transition-all duration-300 group-hover:gap-3">
                  {tTours("viewTour")}
                  <span className="w-7 h-7 rounded-full bg-emerald/10 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald/20 group-hover:scale-110">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
