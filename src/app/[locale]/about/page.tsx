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
    <main className="flex-1 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="section-divider mb-12" />
        <h1
          className="font-heading font-bold text-text"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}
        >
          {t("title")}
        </h1>
        <p className="mt-6 text-text-secondary leading-[1.8]">{t("intro")}</p>
        <p className="mt-4 text-text-secondary leading-[1.8]">{t("story")}</p>

        <div className="mt-12 bg-surface border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-heading font-semibold text-text">
            {t("certificationsTitle")}
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
              <span className="text-sm text-text-secondary">
                {t("certifications.ict")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
              <span className="text-sm text-text-secondary">
                {t("certifications.hacienda")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
              <span className="text-sm text-text-secondary">
                {t("certifications.ccss")}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
