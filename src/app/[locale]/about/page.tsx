import { setRequestLocale } from "next-intl/server";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutContent } from "@/components/about/AboutContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "es"
    ? "Sobre Nosotros · Jungle Wildlife Tours"
    : "About Us · Jungle Wildlife Tours";
  const description = locale === "es"
    ? "Conocé nuestra historia. Somos una empresa local de tours de naturaleza en Manuel Antonio, Costa Rica. Guías certificados, experiencias reales."
    : "Learn our story. We're a local nature tour company in Manuel Antonio, Costa Rica. Certified guides, real experiences.";
  const url = `${SITE_URL}/${locale}/about`;

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
        es: `${SITE_URL}/es/about`,
        en: `${SITE_URL}/en/about`,
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <BreadcrumbJsonLd items={[{ name: "Sobre Nosotros", href: `/${locale}/about` }]} />
      <AboutHero />
      <AboutContent locale={locale} />
    </main>
  );
}
