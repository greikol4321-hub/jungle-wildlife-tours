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
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight font-heading text-canopy-950 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-canopy-950/70 max-w-2xl">{t("subtitle")}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours?.map((tour) => {
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
                      alt={tour.name}
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
                    {t(`categories.${tour.category}`)}
                  </p>
                  <h2 className="mt-2 font-heading text-lg font-semibold text-canopy-950 group-hover:text-canopy-700 transition">
                    {tour.name}
                  </h2>
                  <p className="mt-1 text-sm text-canopy-950/60">
                    {Math.floor(tour.duration_minutes / 60)}h{" "}
                    {tour.duration_minutes % 60}min
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
