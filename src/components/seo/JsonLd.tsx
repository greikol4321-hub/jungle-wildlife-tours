const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TouristInformationCenter"],
  "@id": `${siteUrl}/#organization`,
  name: "Jungle Wildlife Tours",
  url: siteUrl,
  telephone: "+506 8423-0485",
  email: "junglewildlifetours.cr@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manuel Antonio",
    addressRegion: "Quepos",
    addressCountry: "CR",
  },
  image: `${siteUrl}/og-image.jpg`,
  description: "Nature and wildlife tours in Manuel Antonio, Costa Rica. Ground safari, mangrove kayak tour, mangrove boat tour, and night walk.",
  priceRange: "$",
  areaServed: {
    "@type": "City",
    name: "Manuel Antonio",
    sameAs: "https://en.wikipedia.org/wiki/Manuel_Antonio,_Costa_Rica",
  },
  knowsLanguage: ["es", "en"],
  openingHours: "Mo-Su 06:00-20:00",
  sameAs: [
    "https://facebook.com/junglewildlifetours",
    "https://instagram.com/junglewildlifetours",
  ],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Jungle Wildlife Tours",
  url: siteUrl,
  inLanguage: ["es", "en"],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([localBusiness, website]),
      }}
    />
  );
}
