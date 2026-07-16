import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-canopy-950/10 bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-xs text-canopy-950/60 sm:flex-row sm:justify-between sm:text-left">
        <p className="font-semibold tracking-wide text-canopy-950">
          {t("company")}
        </p>
        <p>{t("region")}</p>
        <p>{t("legal")}</p>
      </div>
    </footer>
  );
}
