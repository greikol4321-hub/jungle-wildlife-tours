"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CATEGORY_STYLES } from "@/lib/constants";
import { m, useReducedMotion } from "motion/react";
import { Clock, ArrowRight } from "lucide-react";

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
  description_es: string | null;
  description_en: string | null;
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

export function TourCard({ tour, locale, index, featured }: TourCardProps) {
  const tTours = useTranslations("tours");
  const reduce = useReducedMotion();

  const images = tour.tour_images as TourImage[];
  const cover = images?.find((img) => img.is_cover) ?? images?.[0];
  const title = locale === "es" ? tour.title_es : tour.title_en;
  const desc = locale === "es" ? tour.description_es : tour.description_en;
  const alt = cover
    ? locale === "es" ? cover.alt_text_es : cover.alt_text_en
    : title;
  const durationH = Math.floor(tour.duration_minutes / 60);
  const durationM = tour.duration_minutes % 60;
  const categoryLabel = tTours(`categories.${tour.category}`);
  const meta = CATEGORY_STYLES[tour.category as keyof typeof CATEGORY_STYLES] ?? CATEGORY_STYLES.day_park;

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`h-full ${featured ? "md:col-span-2" : ""}`}
    >
      <Link href={`/tours/${tour.slug}`} className="group block h-full">
        <article
          className={`card h-full overflow-hidden ${featured ? "min-h-[420px] md:min-h-[500px]" : ""}`}
        >
          {/* ── Image layer ── */}
          <div
            className={`overflow-hidden ${
              featured
                ? "absolute inset-0"
                : "relative aspect-[4/3]"
            }`}
          >
            {cover ? (
              <Image
                src={cover.storage_path}
                alt={alt ?? title}
                fill
                sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 40vw"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading={index < 3 ? "eager" : "lazy"}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-surface" />
            )}

            <div
              className={`absolute inset-0 ${
                featured
                  ? "bg-gradient-to-t from-bg via-bg/60 to-bg/10"
                  : "bg-gradient-to-t from-bg/40 to-transparent"
              }`}
              aria-hidden="true"
            />

            {/* ── Badges ── */}
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-bg/70 backdrop-blur-sm ring-1 ${meta.ring} text-text transition-all duration-300 group-hover:bg-bg/90`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} opacity-70`} />
                {categoryLabel}
              </span>
            </div>

            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full bg-bg/60 backdrop-blur-sm border border-border/40 text-text-secondary">
                <Clock className="h-3 w-3 opacity-60" strokeWidth={1.5} aria-hidden="true" />
                {durationH > 0 ? `${durationH}h` : ""}
                {durationM > 0 ? ` ${durationM}min` : ""}
              </span>
            </div>

            {/* ── Hover glow overlay ── */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(135deg, rgba(78,203,113,0.08) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* ── Content layer ── */}
          <div
            className={
              featured
                ? "relative z-10 mt-auto p-6 md:p-8 flex flex-col justify-end min-h-full"
                : "p-5"
            }
          >
            <h3
              className={`font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300 text-balance ${
                featured ? "" : "truncate"
              }`}
              style={{
                fontSize: featured ? "clamp(1.4rem, 3vw, 1.8rem)" : "1.15rem",
                lineHeight: 1.15,
              }}
            >
              {title}
            </h3>

            {desc && (
              <p
                className={`mt-1.5 text-text-secondary leading-relaxed line-clamp-2 ${
                  featured ? "text-sm max-w-lg" : "text-xs"
                }`}
              >
                {desc}
              </p>
            )}

            <div
              className={`flex items-center justify-between ${
                featured ? "mt-5" : "mt-4 pt-3.5 border-t border-border"
              }`}
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[9px] tracking-widest uppercase text-text-muted">
                  {tTours("from")}
                </span>
                <span
                  className="font-mono font-bold text-sand"
                  style={{ fontSize: featured ? "1.5rem" : "1.2rem" }}
                >
                  ${tour.price_usd}
                </span>
              </div>

              <span
                className={`inline-flex items-center gap-2 font-medium transition-all duration-300 group-hover:gap-3 ${
                  featured ? "text-sm text-emerald" : "text-xs text-emerald"
                }`}
              >
                {tTours("viewTour")}
                <span
                  className={`rounded-full bg-emerald/10 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald/20 group-hover:scale-110 ${
                    featured ? "w-8 h-8" : "w-7 h-7"
                  }`}
                >
                  <ArrowRight
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                    style={{ width: featured ? 16 : 14, height: featured ? 16 : 14 }}
                  />
                </span>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </m.div>
  );
}
