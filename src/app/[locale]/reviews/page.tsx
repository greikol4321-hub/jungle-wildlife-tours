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
    <main className="flex-1 px-4 py-24 sm:px-6 lg:px-8">
      <div className="section-divider">
        <div className="section-divider-line" />
        <div className="section-divider-dot" />
      </div>

      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading font-bold text-text" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
          {t("title")}
        </h1>
        <p className="mt-3 text-text-secondary max-w-2xl">{t("subtitle")}</p>

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
                  className="bg-surface border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading font-bold text-text">
                        {review.author_name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {t("by", { country: review.country })}
                      </p>
                    </div>
                    <p className="text-emerald text-lg" aria-label={`${review.rating} stars`}>
                      {Array.from({ length: 5 }, (_, i) =>
                        i < review.rating ? "★" : "☆"
                      ).join("")}
                    </p>
                  </div>
                  <p className="text-text-secondary mt-3">{review.comment}</p>
                  <div className="mt-4 flex items-center justify-between">
                    {tourTitle && (
                      <span className="font-mono text-xs text-emerald">
                        {tourTitle}
                      </span>
                    )}
                    <span className="text-sm text-text-muted ml-auto">
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
          <div className="mt-10 bg-surface-elevated rounded-2xl p-8 text-center">
            <p className="text-sm text-text-secondary">{t("empty")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
