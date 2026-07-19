import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { TourCardsSection } from "@/components/sections/TourCardsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ParallaxDivider } from "@/components/sections/ParallaxDivider";
import { TrustSection } from "@/components/sections/TrustSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQPageJsonLd } from "@/components/seo/FAQPageJsonLd";

const faqKeys = [
  "whatBring",
  "transportIncluded",
  "canChildren",
  "whatWildlife",
  "ifRains",
  "beginnerFriendly",
] as const;

interface Tour {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  description_es: string | null;
  description_en: string | null;
  duration_minutes: number;
  price_usd: number;
  category: string;
  difficulty: string | null;
  languages: string[] | null;
  tour_images: {
    storage_path: string;
    is_cover: boolean;
    alt_text_es: string | null;
    alt_text_en: string | null;
  }[];
}

export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: tours } = await supabase
    .from("tours")
    .select("*, tour_images(*)")
    .eq("is_active", true)
    .order("views", { ascending: false })
    .order("display_order")
    .limit(3);

  const featuredTours = (tours ?? []) as Tour[];

  const tFaq = await getTranslations({ locale, namespace: "faq" });
  const faqQuestions = faqKeys.map((key) => ({
    question: tFaq(key),
    answer: tFaq(`${key}Answer`),
  }));

  return (
    <main className="flex-1">
      <BreadcrumbJsonLd items={[{ name: "Inicio", href: `/${locale}` }]} />
      <FAQPageJsonLd questions={faqQuestions} />
      <HeroSection locale={locale} />

      <TrustSection locale={locale} />

      {featuredTours.length > 0 && (
        <TourCardsSection locale={locale} tours={featuredTours} />
      )}

      <StatsSection locale={locale} />

      <ParallaxDivider locale={locale} />

      <FAQSection locale={locale} />
    </main>
  );
}
