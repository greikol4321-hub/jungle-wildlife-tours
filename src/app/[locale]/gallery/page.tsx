import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const SUPABASE_STORAGE_URL =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

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
    <main className="flex-1 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="section-divider mb-12">
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

        {images && images.length > 0 ? (
          <div className="mt-14 columns-2 sm:columns-3 lg:columns-4 gap-4">
            {images.map((image) => {
              const alt =
                locale === "es" ? image.alt_text_es : image.alt_text_en;
              const caption = image.tours ? tourTitle(image.tours) : null;

              return (
                <div
                  key={image.id}
                  className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden border border-transparent hover:border-[--color-emerald-dim] transition-colors duration-300"
                >
                  <Image
                    src={`${SUPABASE_STORAGE_URL}/${image.storage_path}`}
                    alt={alt || "Gallery photo"}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {caption && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="w-full p-3 text-xs font-medium text-white/90">
                        {caption}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-8 py-20 text-center">
            <Camera className="mb-4 h-10 w-10 text-text-secondary/40" strokeWidth={1.2} />
            <p className="text-sm text-text-secondary">
              {t("mangroveComingSoon")}
            </p>
            <p className="mt-2 text-xs text-text-secondary/60">
              {t("mangroveNote")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
