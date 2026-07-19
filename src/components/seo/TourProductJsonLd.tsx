const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

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

export function TourProductJsonLd({ tour }: { tour: TourProduct }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
