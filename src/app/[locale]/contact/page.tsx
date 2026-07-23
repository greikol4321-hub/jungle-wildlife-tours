import { setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
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
    ? "Contacto · Jungle Wildlife Tours"
    : "Contact · Jungle Wildlife Tours";
  const description = locale === "es"
    ? "Contactanos para reservar tu tour en Manuel Antonio. Safari terrestre, kayak en manglar, tour en barco o caminata nocturna. Respondemos rápido."
    : "Contact us to book your tour in Manuel Antonio. Ground safari, mangrove kayak, boat tour, or night walk. We reply fast.";
  const url = `${SITE_URL}/${locale}/contact`;

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
        es: `${SITE_URL}/es/contact`,
        en: `${SITE_URL}/en/contact`,
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Contacto", href: `/${locale}/contact` }]} />
      <ContactForm locale={locale} />
    </>
  );
}
