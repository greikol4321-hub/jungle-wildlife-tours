import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { TourCardsSection } from "@/components/sections/TourCardsSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ParallaxDivider } from "@/components/sections/ParallaxDivider";

interface Tour {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  short_description_es: string | null;
  short_description_en: string | null;
  duration_minutes: number;
  price_usd: number;
  category: string;
  tour_images: {
    storage_path: string;
    is_cover: boolean;
    alt_text_es: string | null;
    alt_text_en: string | null;
  }[];
}

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
    .order("display_order");

  const featuredTours = (tours ?? []).slice(0, 3) as Tour[];

  return (
    <main className="flex-1">
      {/* ── Hero (parallax + mouse-tracking) ──────────────── */}
      <HeroSection locale={locale} />

      {/* ── Cinematic Parallax Divider ────────────────────── */}
      <ParallaxDivider locale={locale} />

      {/* ── Tour Cards ─────────────────────────────────────── */}
      {featuredTours.length > 0 && (
        <TourCardsSection locale={locale} tours={featuredTours} />
      )}

      {/* ── Trust Badges ────────────────────────────────────── */}
      <TrustSection locale={locale} />
    </main>
  );
}
