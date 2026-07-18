"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { TourCard } from "@/components/tours/TourCard";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

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

interface TourCardsSectionProps {
  tours: Tour[];
  locale: string;
}

export function TourCardsSection({ tours, locale }: TourCardsSectionProps) {
  const tTours = useTranslations("tours");

  if (tours.length === 0) return null;

  return (
    <section className="relative section-gradient-top" aria-labelledby="tours-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[60vw] opacity-[0.04]"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(78,203,113,1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
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

        <Reveal delay={120}>
          <div className="mt-6 mb-14 flex items-center gap-3" aria-hidden="true">
            <div className="h-px w-12 bg-gradient-to-r from-emerald/40 to-transparent" />
            <div className="h-1 w-1 rounded-full bg-emerald/60" />
          </div>
        </Reveal>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-3 auto-rows-auto">
          {tours.slice(0, 3).map((tour, index) => (
            <Reveal key={tour.id} delay={160 + index * 80} className={index === 0 ? "md:row-span-2" : ""}>
              <TourCard
                tour={tour as Tour}
                locale={locale}
                index={index}
                featured={index === 0}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="mt-12 text-center">
            <Link href="/tours" className="btn btn-secondary">
              {tTours("viewDetails")}
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
