import { SITE_URL, SITE } from "@/lib/site-config";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TouristInformationCenter"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE.name,
  url: SITE_URL,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country,
  },
  image: `${SITE_URL}${SITE.businessImage}`,
  description: SITE.defaultDescription,
  priceRange: SITE.priceRange,
  areaServed: {
    "@type": "City",
    name: SITE.address.locality,
    sameAs: "https://en.wikipedia.org/wiki/Manuel_Antonio,_Costa_Rica",
  },
  knowsLanguage: SITE.languages,
  openingHours: SITE.openingHours,
  sameAs: [SITE.socials.facebook, SITE.socials.instagram],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE.name,
  url: SITE_URL,
  inLanguage: SITE.languages,
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
