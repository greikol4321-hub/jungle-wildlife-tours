import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { difficultyLabels } from "@/lib/tour-demo-data";
import { PriceCalculator } from "@/components/tours/PriceCalculator";
import { GalleryLightbox } from "@/components/tours/GalleryLightbox";
import { ReviewsSection } from "@/components/tours/ReviewsSection";
import { Check, X, Clock, Users, Globe, ChevronRight } from "lucide-react";
import { SUPABASE_STORAGE_URL, CATEGORY_STYLES } from "@/lib/constants";

type ItineraryStop = {
  time: string;
  title: string;
  description: string;
};

type TourImage = {
  id: string;
  storage_path: string;
  alt_es?: string;
  alt_en?: string;
};

type Tour = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  category: string;
  duration_minutes: number;
  difficulty: string | null;
  min_age: number | null;
  max_people: number | null;
  price_usd: number | null;
  child_price_usd: number | null;
  languages: string[] | null;
  includes: string[] | null;
  excludes: string[] | null;
  itinerary: ItineraryStop[] | null;
  is_active: boolean;
  tour_images: TourImage[];
};



export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("slug")
    .eq("is_active", true);
  const slugs = tours ?? [];
  return slugs.flatMap((t) => ["es", "en"].map((locale) => ({ locale, slug: t.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data: tour } = await supabase
    .from("tours")
    .select("title_es, title_en")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!tour) return {};

  const title = locale === "es" ? tour.title_es : tour.title_en;
  return { title: `${title} · Jungle Wildlife Tours` };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "tourDetail" });
  const tTours = await getTranslations({ locale, namespace: "tours" });

  const supabase = await createClient();
  const { data: tour } = await supabase
    .from("tours")
    .select("*, tour_images(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!tour) notFound();

  const typedTour = tour as Tour;
  const title = locale === "es" ? typedTour.title_es : typedTour.title_en;
  const description =
    locale === "es" ? typedTour.description_es : typedTour.description_en;
  const categoryLabel =
    tTours(`categories.${typedTour.category}`) ?? typedTour.category;
  const coverImage = typedTour.tour_images[0];
  const cc = CATEGORY_STYLES[typedTour.category as keyof typeof CATEGORY_STYLES] ?? CATEGORY_STYLES.day_park;
  const diffLabel = difficultyLabels[locale][typedTour.difficulty ?? 'easy'] ?? typedTour.difficulty;
  const hours = Math.floor(typedTour.duration_minutes / 60);
  const minutes = typedTour.duration_minutes % 60;

  return (
    <main className="flex-1">
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] md:min-h-[65vh] flex items-end overflow-hidden">
        {coverImage ? (
          <Image
            src={`${SUPABASE_STORAGE_URL}/${coverImage.storage_path}`}
            alt={locale === "es" ? (coverImage.alt_es ?? title) : (coverImage.alt_en ?? title)}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-canopy-deep to-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/60 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <Link
            href={`/${locale}/tours`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald transition-colors hover:text-emerald-bright mb-4"
          >
            <ChevronRight className="h-4 w-4 rotate-180" strokeWidth={2} />
            {t("backToTours")}
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full bg-bg/50 backdrop-blur-sm ring-1 ${cc.ring} text-text`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cc.dot} opacity-70`} />
              {categoryLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-full bg-bg/50 backdrop-blur-sm border border-border/40 text-text-secondary">
              <Clock className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
              {hours > 0 ? `${hours}h ` : ""}{minutes > 0 ? `${minutes}min` : ""}
            </span>
          </div>

          <h1 className="mt-4 font-heading font-bold tracking-[-0.02em] text-balance max-w-3xl text-text"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.08 }}
          >
            {title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        {/* ── INFO BAR ── */}
        <div className="-mt-6 relative z-20 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: t("duration"), value: `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}min` : ""}` },
            { icon: ChevronRight, label: t("difficulty"), value: diffLabel },
            { icon: Users, label: t("maxPeople"), value: `${typedTour.max_people ?? '—'}` },
            { icon: Globe, label: t("language"), value: (typedTour.languages ?? []).join(" / ") || 'Español / English' },
          ].map((item, i) => (
            <div key={i} className="card p-4 md:p-5 flex items-center gap-3 md:gap-4">
              <span className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated border border-border">
                <item.icon className="h-4 w-4 text-emerald" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[9px] tracking-widest uppercase text-text-muted truncate">
                  {item.label}
                </p>
                <p className="font-heading text-sm md:text-base font-bold text-text truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESCRIPTION ── */}
        <section className="mt-12 md:mt-16 max-w-3xl">
          <p className="text-base md:text-lg leading-[1.8] text-text-secondary">
            {description}
          </p>
        </section>

        {/* ── ITINERARY ── */}
        <section className="mt-16 md:mt-20">
          <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" aria-hidden="true" />
          <h2 className="mt-8 font-heading text-xl md:text-2xl font-bold text-text">
            {t("itinerary")}
          </h2>

          <div className="mt-8">
            {(typedTour.itinerary ?? []).length === 1 ? (
              /* Single stop = coordination info card */
              <div className="rounded-lg border border-border bg-surface/50 p-5 md:p-6 flex items-start gap-4">
                <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-dim border border-emerald/20" aria-hidden="true">
                  <svg className="h-4 w-4 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                    <span className="font-mono text-xs tracking-wider text-emerald shrink-0">
                      {(typedTour.itinerary ?? [])[0].time}
                    </span>
                    <h3 className="font-heading font-semibold text-text mt-0.5 sm:mt-0">
                      {(typedTour.itinerary ?? [])[0].title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {(typedTour.itinerary ?? [])[0].description}
                  </p>
                </div>
              </div>
            ) : (
              /* Multi-stop timeline */
              <div className="relative">
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gradient-to-b from-emerald/40 via-border-strong to-transparent" aria-hidden="true" />
                <div className="space-y-8">
                  {(typedTour.itinerary ?? []).map((stop, i) => (
                    <div key={i} className="relative pl-10">
                      <span
                        className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 ${cc.border} bg-bg text-xs font-bold ${cc.text}`}
                      >
                        {i + 1}
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                        <span className="font-mono text-xs tracking-wider text-emerald shrink-0">
                          {stop.time}
                        </span>
                        <div>
                          <h3 className="font-heading font-semibold text-text">
                            {stop.title}
                          </h3>
                          <p className="mt-1 text-sm text-text-secondary leading-relaxed max-w-xl">
                            {stop.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── INCLUDES / EXCLUDES ── */}
        <section className="mt-16 md:mt-20">
          <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" aria-hidden="true" />
          <h2 className="mt-8 font-heading text-xl md:text-2xl font-bold text-text">
            {t("includes")} / {t("excludes")}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="card p-5 md:p-6">
              <h3 className="font-heading text-base font-bold text-text flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/10">
                  <Check className="h-3.5 w-3.5 text-emerald" strokeWidth={2.5} aria-hidden="true" />
                </span>
                {t("includes")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {(typedTour.includes ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" strokeWidth={2.5} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5 md:p-6">
              <h3 className="font-heading text-base font-bold text-text flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-text-muted/10">
                  <X className="h-3.5 w-3.5 text-text-muted" strokeWidth={2} aria-hidden="true" />
                </span>
                {t("excludes")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {(typedTour.excludes ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" strokeWidth={2} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── PRICE CALCULATOR ── */}
        <section className="mt-16 md:mt-20">
          <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" aria-hidden="true" />
          <h2 className="mt-8 font-heading text-xl md:text-2xl font-bold text-text">
            {t("calculator")}
          </h2>
          <div className="mt-6 max-w-lg">
            <PriceCalculator
              priceUsd={typedTour.price_usd ?? 0}
              title={title}
              childPriceUsd={typedTour.child_price_usd ?? undefined}
              locale={locale}
              tourId={typedTour.id}
            />
          </div>
        </section>

        {/* ── GALLERY ── */}
        {typedTour.tour_images.length > 1 && (
          <section className="mt-16 md:mt-20">
            <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" aria-hidden="true" />
            <h2 className="mt-8 font-heading text-xl md:text-2xl font-bold text-text">
              {t("gallery")}
            </h2>
            <GalleryLightbox
              images={typedTour.tour_images}
              locale={locale}
              title={title}
            />
          </section>
        )}

        {typedTour.tour_images.length <= 1 && (
          <p className="mt-16 md:mt-20 font-mono text-xs tracking-wider text-text-muted italic">{t("noImages")}</p>
        )}

        <ReviewsSection tourId={typedTour.id} locale={locale} />
      </div>
    </main>
  );
}
