import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "gallery" });
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("tour_images")
    .select("*, tours(slug, title_es, title_en, category)")
    .order("display_order");

  const tourTitle = (tour: { title_es: string; title_en: string }) =>
    locale === "es" ? tour.title_es : tour.title_en;

  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-semibold tracking-tight font-heading text-canopy-950 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-canopy-950/70 max-w-2xl">{t("subtitle")}</p>

        {images && images.length > 0 ? (
          <div className="mt-10 columns-2 sm:columns-3 lg:columns-4 gap-4">
            {images.map((image) => {
              const alt =
                locale === "es" ? image.alt_text_es : image.alt_text_en;
              const caption = image.tours ? tourTitle(image.tours) : null;

              return (
                <div
                  key={image.id}
                  className="break-inside-avoid mb-4 rounded-2xl overflow-hidden"
                >
                  <Image
                    src={`https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images/${image.storage_path}`}
                    alt={alt || "Gallery photo"}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {caption && (
                    <p className="text-xs text-canopy-950/60 mt-2 px-1">
                      {caption}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-canopy-950/20 bg-white p-8 text-center">
            <p className="text-sm text-canopy-950/70">
              {t("mangroveComingSoon")}
            </p>
            <p className="mt-2 text-xs text-canopy-950/50">
              {t("mangroveNote")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
