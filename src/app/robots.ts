import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

const baseUrl = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: "/admin",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
