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
    <main className="flex-1 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/${locale}/tours`}
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald transition-colors hover:text-emerald-bright"
        >
          ← {t("backToTours")}
        </Link>

        {coverImage && (
          <div className="relative mt-6 aspect-[2/1] w-full max-h-[500px] overflow-hidden rounded-2xl">
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
          <p className="font-mono text-[10px] font-medium tracking-widest text-emerald uppercase">
            {categoryLabel}
          </p>
          <h1 className="mt-2 font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text">
            {title}
          </h1>
          <p className="mt-2 font-mono text-sm text-text-secondary">{duration}</p>
          <p className="mt-6 max-w-3xl leading-[1.8] text-text-secondary">
            {description}
          </p>
        </div>

        {typedTour.tour_images.length > 1 && (
          <section className="mt-12">
            <h2 className="font-heading text-xl font-semibold text-text">
              {t("gallery")}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {typedTour.tour_images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border"
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
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {typedTour.tour_images.length <= 1 && (
          <p className="mt-8 text-sm text-text-secondary italic">{t("noImages")}</p>
        )}

        <div className="mt-12">
          <a
            href={`https://wa.me/50688888888?text=${encodeURIComponent(`Hola, me interesa el tour: ${title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("bookThisTour")}
          </a>
        </div>
      </div>
    </main>
  );
}
