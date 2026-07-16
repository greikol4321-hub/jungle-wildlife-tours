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
  const tTrust = await getTranslations({ locale, namespace: "trust" });

  const supabase = await createClient();

  const { data: tours } = await supabase
    .from("tours")
    .select("*, tour_images(*)")
    .eq("is_active", true)
    .order("display_order");

  const featuredTours = tours?.slice(0, 3) ?? [];

  return (
    <main className="flex-1">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <Image
          src={`${SUPABASE_STORAGE_URL}/jungle-canopy-01.jpg`}
          alt="Dosel de selva tropical"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canopy-950/90 via-canopy-950/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-medium tracking-widest text-moss-200 uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-white font-heading sm:text-7xl lg:text-8xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            {t("description")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tours"
              className="inline-flex items-center justify-center rounded-full bg-canopy-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-canopy-600/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("primaryCta")}
            </Link>
            <a
              href="https://wa.me/50688888888"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-dawn-400 px-8 py-3.5 text-sm font-semibold text-canopy-950 shadow-sm transition hover:bg-dawn-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dawn-400"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("secondaryCta")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Tour Cards ─────────────────────────────────────── */}
      {featuredTours.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-canopy-950/10" />
            <div className="h-3 w-3 rounded-full border-2 border-canopy-600" />
            <div className="h-px flex-1 bg-canopy-950/10" />
          </div>

          <h2 className="mt-10 text-center text-3xl font-bold tracking-tight font-heading text-canopy-950 sm:text-4xl">
            {tTours("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-canopy-950/60">
            {tTours("subtitle")}
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTours.map((tour) => {
              const images = tour.tour_images as {
                storage_path: string;
                is_cover: boolean;
                alt_text_es: string | null;
                alt_text_en: string | null;
              }[];
              const cover =
                images?.find((img) => img.is_cover) ?? images?.[0];
              const title =
                locale === "es" ? tour.title_es : tour.title_en;
              const desc =
                locale === "es"
                  ? tour.short_description_es
                  : tour.short_description_en;
              const alt = cover
                ? locale === "es"
                  ? cover.alt_text_es
                  : cover.alt_text_en
                : title;

              return (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="group rounded-3xl border border-canopy-950/10 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Catalejo circular */}
                  <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-moss-200 shadow-inner">
                    {cover ? (
                      <Image
                        src={`${SUPABASE_STORAGE_URL}/${cover.storage_path}`}
                        alt={alt ?? title}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy-600 to-canopy-950">
                        <svg
                          className="h-12 w-12 text-moss-200/60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="font-mono text-xs font-medium tracking-wide text-canopy-600 uppercase">
                      {tTours(`categories.${tour.category}`)}
                    </p>
                    <h3 className="mt-2 text-lg font-bold font-heading text-canopy-950 group-hover:text-canopy-600 transition">
                      {title}
                    </h3>
                    {desc && (
                      <p className="mt-2 text-sm leading-relaxed text-canopy-950/60 line-clamp-2">
                        {desc}
                      </p>
                    )}
                    <p className="mt-3 font-mono text-xs text-canopy-950/50">
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

      {/* ── Trust Badges ───────────────────────────────────── */}
      <section className="border-y border-canopy-950/10 bg-moss-200/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-4 lg:px-8">
          {(
            ["certifiedGuide", "legalRegistration", "localGuide", "region"] as const
          ).map((key) => (
            <div key={key} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-canopy-600/20 bg-white">
                <svg
                  className="h-5 w-5 text-canopy-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-canopy-950">
                {tTrust(`badges.${key}`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Night Section ──────────────────────────────────── */}
      <section className="relative bg-canopy-950 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-firefly-400 animate-pulse" />
            <p className="font-mono text-xs font-medium tracking-widest text-firefly-400 uppercase">
              {tTours("categories.night_walk")}
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white font-heading sm:text-4xl lg:text-5xl">
            {locale === "es"
              ? "La selva también se vive de noche"
              : "The jungle comes alive at night"}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            {locale === "es"
              ? "La caminata nocturna te muestra una faceta de Manuel Antonio que pocos ven: anfibios, insectos, mamíferos y la actividad que solo ocurre bajo la oscuridad del dosel."
              : "The night walk reveals a side of Manuel Antonio that few see: frogs, insects, mammals, and the activity that only happens under the canopy of darkness."}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tours/caminata-nocturna"
              className="inline-flex items-center justify-center rounded-full bg-firefly-400 px-8 py-3.5 text-sm font-semibold text-canopy-950 shadow-sm transition hover:bg-firefly-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-firefly-400"
            >
              {locale === "es" ? "Más información" : "Learn more"}
            </Link>
            <a
              href="https://wa.me/50688888888"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {tTours("book")}
            </a>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-firefly-400/5 blur-3xl" />
      </section>
    </main>
  );
}
