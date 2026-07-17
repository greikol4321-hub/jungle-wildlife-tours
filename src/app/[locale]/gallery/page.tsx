import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { GalleryContent } from "@/components/gallery/GalleryContent";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: images } = await supabase
    .from("tour_images")
    .select("*, tours(slug, title_es, title_en, category)")
    .order("display_order");

  return <GalleryContent images={images ?? []} locale={locale} />;
}
