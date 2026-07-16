import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const SUPABASE_STORAGE_URL =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tours" });

  const supabase = await createClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("*, tour_images(*)")
    .eq("is_active", true)
    .order("display_order");

  return (
    <main className="flex-1 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Hero header */}
        <div className="section-divider mb-10">
          <div className="section-divider-line" />
          <div className="section-divider-dot" aria-hidden="true" />
          <div className="section-divider-line" />
        </div>

        <h1
          className="text-center font-heading font-bold tracking-[-0.02em] text-text"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}
        >
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-text-secondary text-sm">
          {t("subtitle")}
        </p>

        {/* Tour grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours?.map((tour) => {
            const images = tour.tour_images as {
              storage_path: string;
              is_cover: boolean;
            }[];
            const cover =
              images?.find((img) => img.is_cover) ?? images?.[0];

            const durationH = Math.floor(tour.duration_minutes / 60);
            const durationM = tour.duration_minutes % 60;
            const categoryLabel = t(`categories.${tour.category}`);

            return (
              <Link
                key={tour.id}
                href={`/${locale}/tours/${tour.slug}`}
                className="group block"
              >
                <article className="relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-border-hover hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {cover ? (
                      <Image
                        src={`${SUPABASE_STORAGE_URL}/${cover.storage_path}`}
                        alt={tour.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-surface">
                        <svg className="h-12 w-12 text-emerald/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    )}

                    {/* Vignette */}
                    <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 -60px 80px -40px rgba(11,26,15,0.7)" }} aria-hidden="true" />

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 bg-bg/80 backdrop-blur-md border border-border/50 rounded-full text-text-secondary">
                        <svg className="h-2.5 w-2.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {durationH > 0 ? `${durationH}h` : ""}
                        {durationM > 0 ? ` ${durationM}min` : ""}
                      </span>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 bg-emerald/15 backdrop-blur-md border border-emerald/25 rounded-full text-emerald">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 pb-6">
                    <h3 className="font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300" style={{ fontSize: "1.25rem", letterSpacing: "-0.01em", lineHeight: "1.3" }}>
                      {tour.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      {tour.price_usd != null && (
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading font-bold text-sand" style={{ fontSize: "1.15rem" }}>
                            ${tour.price_usd}
                          </span>
                          <span className="font-mono font-normal text-text-muted text-[10px] uppercase tracking-wider">USD</span>
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1.5 font-medium text-xs text-emerald transition-all duration-300 group-hover:gap-2.5">
                        {locale === "es" ? "Ver tour" : "View tour"}
                        <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
