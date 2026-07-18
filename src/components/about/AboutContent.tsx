"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { ParallaxDivider } from "@/components/sections/ParallaxDivider";

const certificationSigils: Record<string, React.ReactNode> = {
  ict: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" />
      <path d="M15 19l2 2l4 -4" />
    </svg>
  ),
  hacienda: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M13 17.5v4.5l2 -1.5l2 1.5v-4.5" />
      <path d="M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -1 1.73" />
      <path d="M6 9l12 0" />
      <path d="M6 12l3 0" />
      <path d="M6 15l2 0" />
    </svg>
  ),
  ccss: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
    </svg>
  ),
};

const whyUsSigils: Record<string, React.ReactNode> = {
  local: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
    </svg>
  ),
  certified: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M9 9l1 0" />
      <path d="M9 13l6 0" />
      <path d="M9 17l6 0" />
    </svg>
  ),
  small: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    </svg>
  ),
};

const certSubtitles: Record<string, [string, string]> = {
  ict: ["ICT·GARANTÍA", "ICT·GUARANTEE"],
  hacienda: ["HÁGALO LEGAL", "FULLY LEGAL"],
  ccss: ["SEGURIDAD SOCIAL", "SOCIAL SECURITY"],
};

const whyUsSubtitles: Record<string, [string, string]> = {
  local: ["LOCAL·100%", "100%·LOCAL"],
  certified: ["PROFESIONAL", "PROFESSIONAL"],
  small: ["EXCLUSIVO", "EXCLUSIVE"],
};

const certKeys = ["ict", "hacienda", "ccss"] as const;
const whyUsKeys = ["local", "certified", "small"] as const;

export function AboutContent({ locale }: { locale: string }) {
  const tA = useTranslations("about");

  return (
    <>

      {/* ── Story ────────────────────────────────────────── */}
      <section className="relative border-t border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[60vw] opacity-[0.04]"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(78,203,113,1) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-3 mb-12" aria-hidden="true">
              <div className="h-px w-12 bg-gradient-to-r from-emerald/30 to-transparent" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald/40" />
              <div className="h-px flex-1 bg-gradient-to-r from-emerald/20 to-transparent" />
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-2">
              <Reveal>
                <div className="flex items-center gap-2.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald" />
                  <p className="font-display text-[11px] font-medium tracking-[0.22em] text-emerald uppercase">
                    {tA("storyEyebrow")}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h2
                  className="mt-4 font-heading font-bold tracking-tight text-text text-balance"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    lineHeight: 1.1,
                  }}
                >
                  {tA("title")}
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-3">
              <Reveal delay={150}>
                <div className="relative pl-6">
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
                    {tA("story")}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────── */}
      <section className="relative border-t border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[60vw] opacity-[0.03]"
            style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(78,203,113,1) 0%, transparent 70%)" }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <Reveal>
            <div className="flex items-center gap-3 mb-10 md:mb-12" aria-hidden="true">
              <div className="h-px w-12 bg-gradient-to-r from-emerald/30 to-transparent" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald/40" />
              <div className="h-px flex-1 bg-gradient-to-r from-emerald/20 to-transparent" />
            </div>
          </Reveal>

          <Reveal>
            <h2
              className="font-heading font-bold tracking-tight text-text text-balance mb-8"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}
            >
              {tA("certificationsTitle")}
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 border-t border-border">
            {certKeys.map((key, index) => {
              const sub = certSubtitles[key];
              return (
                <Reveal key={key} delay={80 + index * 60}>
                  <div className={`h-full p-6 md:p-10 border-b border-border ${index < 2 ? "sm:border-r border-border" : ""} sm:last:border-b-0`}>
                    <span className="flex h-7 w-7 items-center justify-center text-emerald">
                      {certificationSigils[key]}
                    </span>
                    <p className="mt-5 font-mono text-[11px] leading-[1.6] tracking-[0.12em] text-text">
                      {tA(`certifications.${key}`)}
                    </p>
                    <p className="mt-2 font-mono text-[8px] tracking-[0.2em] text-text-muted uppercase">
                      — {sub[locale === "es" ? 0 : 1]}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={240}>
            <div className="mt-8 text-center">
              <Link
                href="https://wa.me/50688888888"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 13l-2 -2" />
                  <path d="M12 12l2 -2" />
                  <path d="M12 21v-13" />
                  <path d="M9.824 16a3 3 0 0 1 -2.743 -3.69a3 3 0 0 1 .304 -4.833a3 3 0 0 1 4.615 -3.707a3 3 0 0 1 4.614 3.707a3 3 0 0 1 .305 4.833a3 3 0 0 1 -2.919 3.695h-4z" />
                </svg>
                {tA("cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Parallax Divider ──────────────────────────────── */}
      <ParallaxDivider imageSrc="terrestre/wildlife-sloth-01.jpg" />

      {/* ── Why Choose Us ──────────────────────────────────── */}
      <section className="relative border-t border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[60vw] opacity-[0.04]"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(78,203,113,1) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-3 mb-12" aria-hidden="true">
              <div className="h-px w-12 bg-gradient-to-r from-emerald/30 to-transparent" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald/40" />
              <div className="h-px flex-1 bg-gradient-to-r from-emerald/20 to-transparent" />
            </div>
          </Reveal>

          <Reveal>
            <h2
              className="font-heading font-bold tracking-tight text-text text-balance"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              {tA("whyUsTitle")}
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-4 max-w-lg text-text-secondary text-[15px] leading-relaxed">
              {tA("whyUsSubtitle")}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-6 mb-14 flex items-center gap-3" aria-hidden="true">
              <div className="h-px w-12 bg-gradient-to-r from-emerald/40 to-transparent" />
              <div className="h-1 w-1 rounded-full bg-emerald/60" />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 border-t border-border">
            {whyUsKeys.map((key, index) => {
              const sub = whyUsSubtitles[key];
              return (
                <Reveal key={key} delay={160 + index * 80}>
                  <div className={`h-full p-6 md:p-10 border-b border-border ${index < 2 ? "md:border-r border-border" : ""} md:last:border-b-0`}>
                    <span className="flex h-7 w-7 items-center justify-center text-emerald">
                      {whyUsSigils[key]}
                    </span>
                    <h3 className="mt-5 font-mono text-[11px] leading-[1.6] tracking-[0.12em] text-text">
                      {tA(`whyUsCards.${key}Title`)}
                    </h3>
                    <p className="mt-2 font-mono text-[8px] tracking-[0.2em] text-text-muted uppercase">
                      — {sub[locale === "es" ? 0 : 1]}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {tA(`whyUsCards.${key}Body`)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
