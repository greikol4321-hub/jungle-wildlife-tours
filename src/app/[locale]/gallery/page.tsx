import { setRequestLocale } from "next-intl/server";
import { getGalleryImages } from "@/lib/queries";
import { GalleryContent } from "@/components/gallery/GalleryContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
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

  const images = await getGalleryImages();

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Galería", href: `/${locale}/gallery` }]} />
      <GalleryContent images={images} locale={locale} />
    </>
  );
}
