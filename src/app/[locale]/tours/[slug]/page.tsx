import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

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
  is_active: boolean;
  tour_images: TourImage[];
};

const SUPABASE_IMAGE_BASE =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

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
  const duration = `${Math.floor(typedTour.duration_minutes / 60)}h ${typedTour.duration_minutes % 60}min`;
  const coverImage = typedTour.tour_images[0];

  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/${locale}/tours`}
          className="inline-flex items-center gap-1 text-sm font-medium text-canopy-600 hover:text-canopy-950 transition-colors"
        >
          ← {t("backToTours")}
        </Link>

        {coverImage && (
          <div className="relative mt-6 aspect-[2/1] w-full max-h-[500px] overflow-hidden rounded-3xl">
            <Image
              src={`${SUPABASE_IMAGE_BASE}/${coverImage.storage_path}`}
              alt={locale === "es" ? (coverImage.alt_es ?? title) : (coverImage.alt_en ?? title)}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-8">
          <p className="font-mono text-xs font-medium tracking-wide text-canopy-600 uppercase">
            {categoryLabel}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-canopy-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-canopy-600">{duration}</p>
          <p className="mt-6 max-w-3xl leading-relaxed text-canopy-950/70">
            {description}
          </p>
        </div>

        {typedTour.tour_images.length > 1 && (
          <section className="mt-12">
            <h2 className="font-heading text-xl font-semibold text-canopy-950">
              {t("gallery")}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {typedTour.tour_images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-canopy-950/10 bg-white shadow-sm"
                >
                  <Image
                    src={`${SUPABASE_IMAGE_BASE}/${image.storage_path}`}
                    alt={
                      locale === "es"
                        ? (image.alt_es ?? title)
                        : (image.alt_en ?? title)
                    }
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {typedTour.tour_images.length <= 1 && (
          <p className="mt-8 text-sm text-canopy-600 italic">{t("noImages")}</p>
        )}

        <div className="mt-12">
          <a
            href={`https://wa.me/50688888888?text=${encodeURIComponent(`Hola, me interesa el tour: ${title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-canopy-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-canopy-800"
          >
            {t("bookThisTour")}
          </a>
        </div>
      </div>
    </main>
  );
}
