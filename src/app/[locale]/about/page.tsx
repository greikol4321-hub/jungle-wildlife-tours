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
        {/* ── Section Divider ──────────────────────────── */}
        <div className="section-divider mb-12">
          <div className="section-divider-line" />
          <div className="section-divider-dot" />
          <div className="section-divider-line" />
        </div>

        {/* ── Title ────────────────────────────────────── */}
        <h1
          className="font-heading font-bold text-text text-balance"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          {t("title")}
        </h1>

        {/* ── Intro ────────────────────────────────────── */}
        <p
          className="mt-8 text-text-secondary leading-relaxed"
          style={{ fontSize: "clamp(1.05rem, 2vw, 1.2rem)" }}
        >
          {t("intro")}
        </p>

        {/* ── Story ────────────────────────────────────── */}
        <div className="relative mt-14 pl-6">
          <div
            className="absolute left-0 top-0 h-full w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-emerald), transparent 80%)",
            }}
          />
          <p
            className="text-text-secondary leading-relaxed"
            style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)" }}
          >
            {t("story")}
          </p>
        </div>

        {/* ── Certifications ───────────────────────────── */}
        <div className="card mt-14 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-dim">
              <svg
                className="h-5 w-5 text-emerald"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h2 className="font-heading text-xl font-semibold text-text">
              {t("certificationsTitle")}
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <div className="group flex items-start gap-4 rounded-xl p-3 transition-colors duration-300 hover:bg-surface-elevated">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated transition-colors duration-300 group-hover:border-emerald/30">
                <svg
                  className="h-4 w-4 text-emerald"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm leading-relaxed text-text-secondary">
                {t("certifications.ict")}
              </span>
            </div>

            <div className="group flex items-start gap-4 rounded-xl p-3 transition-colors duration-300 hover:bg-surface-elevated">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated transition-colors duration-300 group-hover:border-emerald/30">
                <svg
                  className="h-4 w-4 text-emerald"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm leading-relaxed text-text-secondary">
                {t("certifications.hacienda")}
              </span>
            </div>

            <div className="group flex items-start gap-4 rounded-xl p-3 transition-colors duration-300 hover:bg-surface-elevated">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated transition-colors duration-300 group-hover:border-emerald/30">
                <svg
                  className="h-4 w-4 text-emerald"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm leading-relaxed text-text-secondary">
                {t("certifications.ccss")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Why Choose Us ────────────────────────────── */}
        <div className="mt-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="section-divider-line" />
            <span className="text-xs font-medium uppercase tracking-widest text-emerald">
              {t("whyUsTitle")}
            </span>
            <div className="section-divider-line" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Card 1 */}
            <div className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-emerald/25 hover:bg-surface-elevated hover:shadow-glow-emerald">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-dim">
                <svg
                  className="h-5 w-5 text-emerald"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-base font-semibold text-text">
                {t("whyUsCards.localTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t("whyUsCards.localBody")}
              </p>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-emerald/25 hover:bg-surface-elevated hover:shadow-glow-emerald">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-dim">
                <svg
                  className="h-5 w-5 text-emerald"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-heading text-base font-semibold text-text">
                {t("whyUsCards.certifiedTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t("whyUsCards.certifiedBody")}
              </p>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-emerald/25 hover:bg-surface-elevated hover:shadow-glow-emerald">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-dim">
                <svg
                  className="h-5 w-5 text-emerald"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-base font-semibold text-text">
                {t("whyUsCards.smallTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t("whyUsCards.smallBody")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
