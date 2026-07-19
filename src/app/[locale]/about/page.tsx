import { setRequestLocale } from "next-intl/server";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutContent } from "@/components/about/AboutContent";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import type { Metadata } from "next";

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

  return {
    title,
    description,
    openGraph: { title, description },
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
