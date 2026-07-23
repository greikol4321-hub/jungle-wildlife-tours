import { SITE_URL } from "@/lib/site-config";
const baseUrl = SITE_URL;

type TourProduct = {
  name: string;
  description: string;
  slug: string;
  image: string;
  price: number;
  duration: number;
  category: string;
  locale: string;
};

type ReviewStats = {
  average: number;
  count: number;
};

export function TourProductJsonLd({ tour, reviewStats }: { tour: TourProduct; reviewStats?: ReviewStats | null }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    name: tour.name,
    description: tour.description?.slice(0, 500),
    image: tour.image,
    url: `${baseUrl}/${tour.locale}/tours/${tour.slug}`,
    brand: {
      "@type": "Brand",
      name: "Jungle Wildlife Tours",
    },
    category: tour.category,
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/${tour.locale}/tours/${tour.slug}`,
    },
    touristType: {
      "@type": "Audience",
      name: "Amantes de la naturaleza, fotógrafos, familias",
    },
  };

  if (reviewStats && reviewStats.count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewStats.average.toFixed(1),
      reviewCount: reviewStats.count,
      bestRating: 5,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
