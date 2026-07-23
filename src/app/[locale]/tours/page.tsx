import { setRequestLocale } from "next-intl/server";
import { getActiveTours } from "@/lib/queries";
import { ToursHero } from "@/components/tours/ToursHero";
import { ToursGrid } from "@/components/tours/ToursGrid";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "es"
    ? "Tours de Naturaleza · Manuel Antonio, Costa Rica"
    : "Nature Tours · Manuel Antonio, Costa Rica";
  const description = locale === "es"
    ? "Explorá nuestros tours guiados en Manuel Antonio: safari terrestre, tour en kayak en manglar, tour en barco por los manglares y caminata nocturna. Guías locales certificados."
    : "Explore our guided tours in Manuel Antonio: ground safari, mangrove kayak tour, mangrove boat tour, and night walk. Certified local guides.";
  const url = `${SITE_URL}/${locale}/tours`;

  return {
    title,
    description,
    openGraph: { title, description, url },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es/tours`,
        en: `${SITE_URL}/en/tours`,
      },
    },
  };
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tours = await getActiveTours();

  return (
    <main className="flex-1">
      <BreadcrumbJsonLd items={[{ name: "Tours", href: `/${locale}/tours` }]} />
      <ToursHero locale={locale} />
      <ToursGrid tours={tours} locale={locale} />
    </main>
  );
}
