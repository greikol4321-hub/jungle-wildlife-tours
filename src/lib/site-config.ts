export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jungle-wildlife-tours.vercel.app";

export const SITE = {
  name: "Jungle Wildlife Tours",
  tagline: "Manuel Antonio, Costa Rica",
  defaultTitle: "Jungle Wildlife Tours · Manuel Antonio, Costa Rica",
  defaultDescription: "Nature and wildlife tours in Manuel Antonio, Costa Rica. Ground safari, mangrove walk, and night walk with ICT-certified local guides.",
  phone: "+506 8423-0485",
  email: "junglewildlifetours.cr@gmail.com",
  address: {
    locality: "Manuel Antonio",
    region: "Quepos",
    country: "CR",
  },
  socials: {
    facebook: "https://facebook.com/junglewildlifetours",
    instagram: "https://instagram.com/junglewildlifetours",
  },
  openingHours: "Mo-Su 06:00-20:00",
  priceRange: "$",
  languages: ["es", "en"] as const,
  businessImage: "/images/logo-toucan.svg",
} as const;
