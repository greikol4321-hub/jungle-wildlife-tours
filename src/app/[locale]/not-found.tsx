import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "es"
    ? "Página no encontrada · Jungle Wildlife Tours"
    : "Page not found · Jungle Wildlife Tours";
  const description = locale === "es"
    ? "La página que buscas no existe. Volvé al inicio para encontrar el tour perfecto en Manuel Antonio."
    : "The page you're looking for doesn't exist. Go back home to find the perfect tour in Manuel Antonio.";

  return {
    title,
    description,
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1
        className="font-heading font-bold text-text"
        style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
      >
        404
      </h1>
      <p className="mt-3 text-lg text-text-secondary">
        {t("message")}
      </p>
      <Link
        href="/"
        className="btn btn-primary mt-8 inline-flex items-center gap-2"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
