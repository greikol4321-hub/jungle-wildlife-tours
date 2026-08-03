import type { Metadata } from "next";
import { SITE_URL, SITE } from "@/lib/site-config";

type PageMetaInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogImage?: { url: string; width?: number; height?: number };
};

export function generatePageMetadata({ locale, path, title, description, ogImage }: PageMetaInput): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    title: `${title} · ${SITE.name}`,
    description,
    openGraph: {
      title: `${title} · ${SITE.name}`,
      description,
      url,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE.name}`,
      description,
    },
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es${path}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
  };
}
