import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

const SUPABASE_STORAGE_URL =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "hero" });
  const tTours = await getTranslations({ locale, namespace: "tours" });
  const tReviews = await getTranslations({ locale, namespace: "reviews" });

  const supabase = await createClient();

  const { data: tours } = await supabase
    .from("tours")
    .select("*, tour_images(*)")
    .eq("is_active", true)
    .order("display_order");

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(2);

  const featuredTours = tours?.slice(0, 3) ?? [];

  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold tracking-wide text-canopy-600 font-mono uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl font-heading text-canopy-950">
          {t("title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-canopy-950/80 max-w-2xl mx-auto">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="#tours"
            className="inline-flex items-center justify-center rounded-full bg-canopy-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-canopy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-600"
          >
            {t("primaryCta")}
          </a>
          <a
            href="#whatsapp"
            className="inline-flex items-center justify-center rounded-full border border-canopy-600/20 bg-white px-6 py-3 text-sm font-semibold text-canopy-950 transition hover:border-canopy-600/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-600"
          >
            {t("secondaryCta")}
          </a>
        </div>
      </section>

      {/* Featured tours */}
      {featuredTours.length > 0 && (
        <section id="tours" className="mt-20 mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold tracking-tight font-heading text-canopy-950 sm:text-3xl">
            {tTours("title")}
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTours.map((tour) => {
              const images = tour.tour_images as {
                storage_path: string;
                is_cover: boolean;
              }[];
              const cover =
                images?.find((img) => img.is_cover) ?? images?.[0];

              return (
                <Link
                  key={tour.id}
                  href={`/${locale}/tours/${tour.slug}`}
                  className="group rounded-3xl border border-canopy-950/10 bg-white shadow-sm overflow-hidden transition hover:shadow-md"
                >
                  <div className="relative aspect-[3/2]">
                    {cover ? (
                      <Image
                        src={`${SUPABASE_STORAGE_URL}/${cover.storage_path}`}
                        alt={locale === "es" ? tour.title_es : tour.title_en}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover rounded-t-3xl"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-canopy-600 to-canopy-950 rounded-t-3xl" />
                    )}
                  </div>

                  <div className="p-5">
                    <p className="font-mono text-xs font-medium tracking-wide text-canopy-600 uppercase">
                      {tTours(`categories.${tour.category}`)}
                    </p>
                    <h3 className="mt-2 font-heading text-lg font-semibold text-canopy-950 group-hover:text-canopy-700 transition">
                      {locale === "es" ? tour.title_es : tour.title_en}
                    </h3>
                    {(locale === "es" ? tour.short_description_es : tour.short_description_en) && (
                      <p className="mt-1 text-sm text-canopy-950/60 line-clamp-2">
                        {locale === "es" ? tour.short_description_es : tour.short_description_en}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-canopy-950/60">
                      {Math.floor(tour.duration_minutes / 60)}h{" "}
                      {tour.duration_minutes % 60}min
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Reviews teaser */}
      {reviews && reviews.length > 0 && (
        <section className="mt-20 mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold tracking-tight font-heading text-canopy-950 sm:text-3xl">
            {tReviews("title")}
          </h2>
          <p className="mt-2 text-canopy-950/70">{tReviews("subtitle")}</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-canopy-950/10 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-1 text-canopy-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-canopy-600" : "fill-canopy-950/10"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-3 text-sm text-canopy-950/80 line-clamp-3">
                  {locale === "es" ? review.comment_es : review.comment_en}
                </p>
                <p className="mt-3 text-sm font-medium text-canopy-950">
                  {review.author_name}
                  {review.author_country && (
                    <span className="font-normal text-canopy-950/60">
                      {" "}
                      · {review.author_country}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
