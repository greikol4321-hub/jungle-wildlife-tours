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
        <h1
          className="font-heading font-bold text-text"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          {t("title")}
        </h1>
        <p className="mt-4 text-text-secondary max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>

        {reviews && reviews.length > 0 ? (
          <div className="mt-12 space-y-5">
            {reviews.map((review) => {
              const tourTitle =
                locale === "es"
                  ? review.tours?.title_es
                  : review.tours?.title_en;
              return (
                <div
                  key={review.id}
                  className="relative bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-border-hover"
                  style={{
                    boxShadow: "var(--shadow-card)",
                    borderLeft: "3px solid var(--color-emerald)",
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-text text-base">
                          {review.author_name}
                        </p>
                        <p className="text-sm text-text-secondary mt-0.5">
                          {t("by", { country: review.country })}
                        </p>
                      </div>
                      <p
                        className="shrink-0 text-emerald text-lg tracking-wide"
                        aria-label={`${review.rating} stars`}
                      >
                        {Array.from({ length: 5 }, (_, i) =>
                          i < review.rating ? "★" : "☆"
                        ).join("")}
                      </p>
                    </div>

                    <p className="text-text-secondary mt-4 leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      {tourTitle && (
                        <span
                          className="inline-flex items-center font-mono text-xs px-3 py-1 rounded-full"
                          style={{
                            background: "var(--color-emerald-dim)",
                            color: "var(--color-emerald)",
                          }}
                        >
                          {tourTitle}
                        </span>
                      )}
                      <span className="text-xs text-text-muted ml-auto">
                        {new Date(review.created_at).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 bg-surface border border-border rounded-2xl p-12 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "var(--color-emerald-dim)" }}
            >
              <svg
                className="h-8 w-8"
                style={{ color: "var(--color-emerald)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <p className="text-text-secondary">{t("empty")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
