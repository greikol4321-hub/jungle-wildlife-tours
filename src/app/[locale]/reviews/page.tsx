import { createClient } from "@/lib/supabase/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "reviews" });

  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, tours(title_es, title_en)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight font-heading text-canopy-950 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-canopy-950/70 max-w-2xl">{t("subtitle")}</p>

        {reviews && reviews.length > 0 ? (
          <div className="mt-10 space-y-6">
            {reviews.map((review) => {
              const tourTitle =
                locale === "es"
                  ? review.tours?.title_es
                  : review.tours?.title_en;
              return (
                <div
                  key={review.id}
                  className="rounded-3xl border border-canopy-950/10 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-canopy-950">
                        {review.author_name}
                      </p>
                      <p className="text-sm text-canopy-950/60">
                        {t("by", { country: review.country })}
                      </p>
                    </div>
                    <p className="text-firefly-400 text-lg" aria-label={`${review.rating} stars`}>
                      {Array.from({ length: 5 }, (_, i) =>
                        i < review.rating ? "★" : "☆"
                      ).join("")}
                    </p>
                  </div>
                  <p className="text-canopy-950/80 mt-3">{review.comment}</p>
                  <div className="mt-4 flex items-center justify-between">
                    {tourTitle && (
                      <span className="font-mono text-xs text-canopy-600">
                        {tourTitle}
                      </span>
                    )}
                    <span className="text-sm text-canopy-950/50 ml-auto">
                      {new Date(review.created_at).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl bg-moss-200/60 p-8 text-center">
            <p className="text-sm text-canopy-950/70">{t("empty")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
