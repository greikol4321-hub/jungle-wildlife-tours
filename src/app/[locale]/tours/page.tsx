import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Clock, ArrowRight, Camera, MapPin } from "lucide-react";

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
        {/* Header */}
        <div className="section-divider mb-10">
          <div className="section-divider-line" />
          <div className="section-divider-dot" aria-hidden="true" />
          <div className="section-divider-line" />
        </div>

        <h1
          className="text-center font-heading font-extrabold tracking-tight text-text"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            textShadow: "0 2px 24px rgba(78,203,113,0.12)",
          }}
        >
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-center text-text-secondary text-sm leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Tour grid or empty state */}
        {tours && tours.length > 0 ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => {
              const images = tour.tour_images as {
                storage_path: string;
                is_cover: boolean;
              }[];
              const cover = images?.find((img) => img.is_cover) ?? images?.[0];

              const desc =
                locale === "es"
                  ? tour.short_description_es
                  : tour.short_description_en;

              const durationH = Math.floor(tour.duration_minutes / 60);
              const durationM = tour.duration_minutes % 60;
              const categoryLabel = t(`categories.${tour.category}`);

              return (
                <Link
                  key={tour.id}
                  href={`/${locale}/tours/${tour.slug}`}
                  className="group block"
                >
                  <article
                    className="relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-border-hover hover:-translate-y-1"
                    style={{
                      boxShadow:
                        "var(--shadow-card, 0 4px 24px -8px rgba(0,0,0,0.3))",
                    }}
                  >
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
                          <Camera
                            className="h-12 w-12 text-emerald/20"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>
                      )}

                      {/* Bottom gradient overlay */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent"
                        aria-hidden="true"
                      />

                      {/* Duration Badge */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 bg-bg/60 backdrop-blur-md border border-border/50 rounded-full text-text-secondary">
                          <Clock
                            className="h-3 w-3 opacity-60"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
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
                      <h3
                        className="font-heading font-bold text-text group-hover:text-emerald transition-colors duration-300"
                        style={{
                          fontSize: "1.25rem",
                          letterSpacing: "-0.01em",
                          lineHeight: "1.3",
                        }}
                      >
                        {tour.name}
                      </h3>

                      {desc && (
                        <p className="mt-2.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                          {desc}
                        </p>
                      )}

                      <div className="mt-4 border-t border-border pt-4">
                        <div className="flex items-center justify-between">
                          {tour.price_usd != null && (
                            <div className="flex items-baseline gap-1">
                              <span
                                className="font-heading font-bold text-sand"
                                style={{ fontSize: "1.15rem" }}
                              >
                                ${tour.price_usd}
                              </span>
                              <span className="font-mono font-normal text-text-secondary text-[10px] uppercase tracking-wider">
                                USD
                              </span>
                            </div>
                          )}

                          <span className="inline-flex items-center gap-1.5 font-medium text-xs text-emerald transition-all duration-300 group-hover:gap-2.5">
                            {locale === "es" ? "Ver tour" : "View tour"}
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface border border-border">
              <MapPin
                className="h-8 w-8 text-text-secondary"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-6 font-heading font-bold text-text text-lg">
              {locale === "es"
                ? "No hay tours disponibles"
                : "No tours available"}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">
              {locale === "es"
                ? "Vuelve pronto para descubrir nuevas aventuras en la selva."
                : "Check back soon to discover new jungle adventures."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
