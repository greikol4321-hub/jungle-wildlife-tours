import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["es", "en"] as const;

  const routes = ["", "/tours", "/about", "/gallery", "/reviews", "/contact"];

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/es${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    }))
  );
}
