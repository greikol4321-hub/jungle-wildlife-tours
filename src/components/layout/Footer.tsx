import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 sm:flex-row sm:justify-between sm:text-left">
        <p className="font-heading font-semibold tracking-wide text-text" style={{ fontSize: "0.9rem" }}>
          Jungle Wildlife Tours
        </p>
        <p className="text-text-secondary text-sm">
          Manuel Antonio · Quepos
        </p>
        <p className="text-text-secondary text-sm">
          {t("legal")}
        </p>
      </div>
    </footer>
  );
}