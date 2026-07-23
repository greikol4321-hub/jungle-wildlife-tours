import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { SITE_URL } from "@/lib/site-config";

const baseUrl = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["es", "en"] as const;
  const routes = ["", "/tours", "/about", "/gallery", "/contact"];

  const supabase = createStaticClient();
  const now = new Date();

  const staticPages = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? ("monthly" as const) : ("weekly" as const),
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/es${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    }))
  );

  const { data: tours } = await supabase
    .from("tours")
    .select("slug, created_at")
    .eq("is_active", true);

  const tourPages = (tours ?? []).flatMap((tour) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/tours/${tour.slug}`,
      lastModified: new Date(tour.created_at ?? now),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/es/tours/${tour.slug}`,
          en: `${baseUrl}/en/tours/${tour.slug}`,
        },
      },
    }))
  );

  return [...staticPages, ...tourPages];
}
