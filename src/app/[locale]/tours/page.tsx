import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ToursHero } from "@/components/tours/ToursHero";
import { ToursGrid } from "@/components/tours/ToursGrid";
import type { Metadata } from "next";

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
    ? "Explorá nuestros tours guiados en Manuel Antonio: safari terrestre, caminata en manglar y caminata nocturna. Guías locales certificados."
    : "Explore our guided tours in Manuel Antonio: ground safari, mangrove walk, and night walk. Certified local guides.";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function ToursPage({
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

  return (
    <main className="flex-1">
      <ToursHero locale={locale} />
      <ToursGrid tours={tours ?? []} locale={locale} />
    </main>
  );
}
