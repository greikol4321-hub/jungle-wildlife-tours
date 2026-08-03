import { getApprovedReviews } from "@/app/actions/reviews";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  comment_es: string | null;
  comment_en: string | null;
  created_at: string | null;
};

export async function ReviewJsonLd({ tourId, locale }: { tourId: string; locale: string }) {
  const reviews = (await getApprovedReviews(tourId)) as Review[];
  if (!reviews.length) return null;

  const items = reviews.map((r) => ({
    "@type": "Review" as const,
    author: { "@type": "Person" as const, name: r.author_name },
    reviewRating: {
      "@type": "Rating" as const,
      ratingValue: r.rating,
      bestRating: 5,
    },
    reviewBody: locale === "es" ? (r.comment_es ?? r.comment_en ?? "") : (r.comment_en ?? r.comment_es ?? ""),
    ...(r.created_at ? { datePublished: r.created_at } : {}),
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": items }),
      }}
    />
  );
}
