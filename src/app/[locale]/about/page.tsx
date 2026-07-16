import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight font-heading text-canopy-950 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-canopy-950/80 leading-relaxed">{t("intro")}</p>
        <p className="mt-4 text-canopy-950/80 leading-relaxed">{t("story")}</p>

        <div className="mt-10 rounded-3xl bg-moss-200/60 p-6 sm:p-8">
          <h2 className="text-lg font-semibold font-heading text-canopy-950">
            {t("certificationsTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-canopy-950/80">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-canopy-600" />
              {t("certifications.ict")}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-canopy-600" />
              {t("certifications.hacienda")}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-canopy-600" />
              {t("certifications.ccss")}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
