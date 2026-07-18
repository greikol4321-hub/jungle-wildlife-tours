"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { m, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { TourCard } from "./TourCard";
import { ToursFilter } from "./ToursFilter";

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
  difficulty: string | null;
  languages: string[] | null;
  tour_images: TourImage[];
}

interface ToursGridProps {
  tours: Tour[];
  locale: string;
}

const categoryKeys = ["day_park", "mangrove", "night_walk"] as const;

export function ToursGrid({ tours, locale }: ToursGridProps) {
  const t = useTranslations("tours");
  const reduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = categoryKeys.map((key) => ({
    key,
    label: t(`categories.${key}`),
  }));

  const filtered = useMemo(
    () =>
      activeCategory
        ? tours.filter((t) => t.category === activeCategory)
        : tours,
    [tours, activeCategory],
  );

  if (tours.length === 0) {
    return (
      <m.div
        className="flex flex-col items-center justify-center text-center py-20"
        initial={reduce ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface border border-border">
          <MapPin className="h-8 w-8 text-text-secondary" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h2 className="mt-6 font-heading font-bold text-text text-lg">{t("emptyTitle")}</h2>
        <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">{t("emptyBody")}</p>
      </m.div>
    );
  }

  return (
    <section className="relative">
      {/* Divider at top between hero and grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-strong to-transparent" />
          <div className="h-2 w-2 rounded-full bg-emerald shadow-[0_0_6px_var(--color-emerald-glow)]" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Filter bar */}
        <m.div
          className="mb-10"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ToursFilter categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        </m.div>

        {/* Grid asimétrico */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          {filtered.map((tour, i) => (
            <TourCard
              key={tour.id}
              tour={tour as Tour}
              locale={locale}
              index={i}
              featured={i === 0 && activeCategory === null}
            />
          ))}
        </div>

        {/* Counter */}
        {filtered.length > 0 && (
          <m.p
            className="mt-10 text-center font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filtered.length}{" "}
            {filtered.length === 1
              ? locale === "es" ? "experiencia" : "experience"
              : locale === "es" ? "experiencias" : "experiences"}
          </m.p>
        )}
      </div>
    </section>
  );
}
