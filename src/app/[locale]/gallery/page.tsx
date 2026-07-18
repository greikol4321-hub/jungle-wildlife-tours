import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { GalleryContent } from "@/components/gallery/GalleryContent";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "es"
    ? "Galería · Jungle Wildlife Tours"
    : "Gallery · Jungle Wildlife Tours";
  const description = locale === "es"
    ? "Galería de fotos reales de fauna y naturaleza en Manuel Antonio, Costa Rica."
    : "Real wildlife and nature photo gallery from Manuel Antonio, Costa Rica.";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

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
    .order("display_order")
    .limit(100);

  return <GalleryContent images={images ?? []} locale={locale} />;
}
