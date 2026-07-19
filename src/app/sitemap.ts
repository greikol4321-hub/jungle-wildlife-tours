import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://junglewildlifetours.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["es", "en"] as const;
  const routes = ["", "/tours", "/about", "/gallery", "/contact"];

  const staticPages = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
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

  const supabase = createStaticClient();
  const { data: tours } = await supabase.from("tours").select("slug").eq("is_active", true);

  const tourPages = (tours ?? []).flatMap((tour) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/tours/${tour.slug}`,
      lastModified: new Date(),
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
