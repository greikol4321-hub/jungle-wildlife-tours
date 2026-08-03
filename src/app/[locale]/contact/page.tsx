import { setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "es" ? "Contacto" : "Contact";
  const description = locale === "es"
    ? "Contactanos para reservar tu tour en Manuel Antonio. Safari terrestre, kayak en manglar, tour en barco o caminata nocturna. Respondemos rápido."
    : "Contact us to book your tour in Manuel Antonio. Ground safari, mangrove kayak, boat tour, or night walk. We reply fast.";
  return generatePageMetadata({ locale, path: "/contact", title, description });
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
