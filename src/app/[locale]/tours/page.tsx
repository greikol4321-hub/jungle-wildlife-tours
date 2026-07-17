import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ToursHero } from "@/components/tours/ToursHero";
import { ToursGrid } from "@/components/tours/ToursGrid";

export const revalidate = 3600;

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
