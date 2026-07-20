import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getTourBySlug, getTourSlugs } from "@/lib/queries";
import { difficultyLabels } from "@/lib/constants";
import { PriceCalculator } from "@/components/tours/PriceCalculator";
import { GalleryLightbox } from "@/components/tours/GalleryLightbox";
import { ReviewsSection } from "@/components/tours/ReviewsSection";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { TourViewTracker } from "@/components/tours/TourViewTracker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { TourProductJsonLd } from "@/components/seo/TourProductJsonLd";
import { SITE_URL } from "@/lib/site-config";
import { Check, X, Clock, Users, Globe, ChevronRight, UserCheck } from "lucide-react";
import { CATEGORY_STYLES } from "@/lib/constants";

type ItineraryStop = {
  time: string;
  title: string;
  description: string;
};

type TourImage = {
  id: string;
  storage_path: string;
  is_cover: boolean;
  alt_text_es?: string;
  alt_text_en?: string;
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
  child_max_age: number | null;
  languages: string[] | null;
  includes: string[] | null;
  excludes: string[] | null;
  includes_en: string[] | null;
  excludes_en: string[] | null;
  itinerary: ItineraryStop[] | null;
  tide_table: TideEntry[] | null;
  is_active: boolean;
  views: number;
  tour_images: TourImage[];
};

type TideEntry = {
  date: string;
  time: string;
  height_m: number;
  type: "high" | "low";
};



export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getTourSlugs();
  return slugs.flatMap((t) => ["es", "en"].map((locale) => ({ locale, slug: t.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const [{ locale, slug }] = await Promise.all([params]);
  const tour = await getTourBySlug(slug);

  if (!tour) return {};

  const title = locale === "es" ? tour.title_es : tour.title_en;
  const description = locale === "es" ? tour.description_es : tour.description_en;
  const coverImg = (tour.tour_images as unknown as { url: string }[] | undefined)?.[0];
  const ogImage = coverImg?.url ?? `${SITE_URL}/og-image.jpg`;

  return {
    title: `${title} · Jungle Wildlife Tours`,
    description: description?.slice(0, 160) ?? undefined,
    openGraph: {
      title: `${title} · Jungle Wildlife Tours`,
      description: description?.slice(0, 160) ?? undefined,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Jungle Wildlife Tours`,
      description: description?.slice(0, 160) ?? undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/tours/${slug}`,
      languages: {
        es: `${SITE_URL}/es/tours/${slug}`,
        en: `${SITE_URL}/en/tours/${slug}`,
      },
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const [{ locale, slug }] = await Promise.all([params]);
  setRequestLocale(locale);

  const [[t, tTours], tour] = await Promise.all([
    Promise.all([
      getTranslations({ locale, namespace: "tourDetail" }),
      getTranslations({ locale, namespace: "tours" }),
    ]),
    getTourBySlug(slug),
  ]);

  if (!tour) notFound();

  const typedTour = tour as Tour;

  const galleryImages = typedTour.tour_images;

  const title = locale === "es" ? typedTour.title_es : typedTour.title_en;
  const description =
    locale === "es" ? typedTour.description_es : typedTour.description_en;
  const categoryLabel =
    tTours(`categories.${typedTour.category}`) ?? typedTour.category;
  const includesList = locale === "en" && typedTour.includes_en ? typedTour.includes_en : typedTour.includes;
  const excludesList = locale === "en" && typedTour.excludes_en ? typedTour.excludes_en : typedTour.excludes;
  const coverImage = typedTour.tour_images.find((img) => img.is_cover) ?? typedTour.tour_images[0];
  const cc = CATEGORY_STYLES[typedTour.category as keyof typeof CATEGORY_STYLES] ?? CATEGORY_STYLES.day_park;
  const diffLabel = difficultyLabels[locale][typedTour.difficulty ?? 'easy'] ?? typedTour.difficulty;
  const hours = Math.floor(typedTour.duration_minutes / 60);
  const minutes = typedTour.duration_minutes % 60;

  const coverImgUrl = coverImage?.storage_path ?? "";

  return (
    <main className="flex-1">
      <TourViewTracker tourId={typedTour.id} />
      <BreadcrumbJsonLd items={[{ name: "Tours", href: `/${locale}/tours` }, { name: title, href: `/${locale}/tours/${slug}` }]} />
      <TourProductJsonLd
        tour={{
          name: title,
          description: description ?? "",
          slug,
          image: coverImgUrl,
          price: typedTour.price_usd ?? 0,
          duration: typedTour.duration_minutes,
          category: categoryLabel,
          locale,
        }}
      />
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] md:min-h-[65vh] flex items-end overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage.storage_path}
            alt={locale === "es" ? (coverImage.alt_text_es ?? title) : (coverImage.alt_text_en ?? title)}
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
        <div className="-mt-6 relative z-20 grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { icon: Clock, label: t("duration"), value: `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}min` : ""}` },
            { icon: ChevronRight, label: t("difficulty"), value: diffLabel },
            { icon: Users, label: t("maxPeople"), value: `${typedTour.max_people ?? '—'}` },
            { icon: Globe, label: t("language"), value: (typedTour.languages ?? []).join(" / ") || 'Español / English' },
            { icon: UserCheck, label: t("minAge"), value: typedTour.min_age != null && typedTour.min_age > 0 ? `${typedTour.min_age} ${t("years")}` : t("allAges") },
          ].map((item) => (
            <div key={item.label} className="card p-4 md:p-5 flex items-center gap-3 md:gap-4">
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

        {/* ── SHARE ── */}
        <div className="mt-6">
          <ShareButtons title={title} />
        </div>

        {/* ── DESCRIPTION ── */}
        <section className="mt-12 md:mt-16 max-w-3xl">
          <p className="text-base md:text-lg leading-[1.8] text-text-secondary">
            {description}
          </p>
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
                {(includesList ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
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
                {(excludesList ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" strokeWidth={2} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── TIDE TABLE ── */}
        {typedTour.category === "mangrove" && Array.isArray(typedTour.tide_table) && typedTour.tide_table.length > 0 && (
          <section className="mt-16 md:mt-20">
            <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" aria-hidden="true" />
            <h2 className="mt-8 font-heading text-xl md:text-2xl font-bold text-text">
              Tabla de mareas
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Horarios estimados de mareas para la navegación en el manglar.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted font-mono text-[10px] tracking-widest uppercase">
                    <th className="py-3 pr-4 text-left">Fecha</th>
                    <th className="py-3 pr-4 text-left">Hora</th>
                    <th className="py-3 pr-4 text-left">Altura</th>
                    <th className="py-3 text-left">Marea</th>
                  </tr>
                </thead>
                <tbody>
                  {typedTour.tide_table.map((entry, i) => (
                    <tr key={`tide-${entry.date}-${entry.time}`} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 text-text">{entry.date}</td>
                      <td className="py-3 pr-4 text-text">{entry.time}</td>
                      <td className="py-3 pr-4 text-text">{entry.height_m}m</td>
                      <td className="py-3 text-text">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] tracking-wider uppercase ${
                          entry.type === "high"
                            ? "bg-sky-500/10 text-sky-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {entry.type === "high" ? "Alta" : "Baja"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

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
              minAge={typedTour.min_age ?? undefined}
              childMaxAge={typedTour.child_max_age ?? undefined}
              locale={locale}
              tourId={typedTour.id}
            />
          </div>
        </section>

        {/* ── GALLERY ── */}
        {galleryImages.length > 0 && (
          <section className="mt-16 md:mt-20">
            <div className="h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" aria-hidden="true" />
            <h2 className="mt-8 font-heading text-xl md:text-2xl font-bold text-text">
              {t("gallery")}
            </h2>
            <GalleryLightbox
              images={galleryImages}
              locale={locale}
              title={title}
            />
          </section>
        )}

        {galleryImages.length === 0 && (
          <p className="mt-16 md:mt-20 font-mono text-xs tracking-wider text-text-muted italic">{t("noImages")}</p>
        )}

        <ReviewsSection tourId={typedTour.id} locale={locale} />
      </div>
    </main>
  );
}
