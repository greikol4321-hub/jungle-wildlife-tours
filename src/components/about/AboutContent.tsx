"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { ShieldCheck, BadgeCheck, Users, MapPin, Heart, ScrollText, Trees } from "lucide-react";

const certifications = [
  { key: "ict", icon: ShieldCheck },
  { key: "hacienda", icon: BadgeCheck },
  { key: "ccss", icon: Users },
] as const;

const whyUsCards = [
  { key: "local", icon: MapPin },
  { key: "certified", icon: ScrollText },
  { key: "small", icon: Heart },
] as const;

export function AboutContent() {
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
      <section className="relative border-t border-border bg-surface/50">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {certifications.map(({ key, icon: Icon }, index) => (
              <Reveal key={key} delay={80 + index * 60}>
                <div className="group relative rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-emerald/20 hover:shadow-[0_0_40px_-12px_rgba(78,203,113,0.15)]">
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

                  <div className="p-5 md:p-7 flex flex-col gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10 ring-1 ring-emerald/15 transition-all duration-300 group-hover:bg-emerald/15 group-hover:ring-emerald/25">
                      <Icon className="h-5 w-5 text-emerald" strokeWidth={1.5} aria-hidden="true" />
                    </div>

                    <p className="font-display text-[15px] md:text-base font-semibold text-text leading-snug tracking-[-0.01em]">
                      {tA(`certifications.${key}`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={240}>
            <div className="mt-8 text-center">
              <Link
                href="https://wa.me/50688888888"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Trees className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {tA("cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Parallax Divider ──────────────────────────────── */}
      <ParallaxAboutDivider />

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

          <div className="grid gap-5 grid-cols-1 md:grid-cols-3 auto-rows-auto">
            {whyUsCards.map(({ key, icon: Icon }, index) => (
              <Reveal key={key} delay={160 + index * 80}>
                <div className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-emerald/25 hover:bg-surface-elevated hover:shadow-glow-emerald">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-dim">
                    <Icon className="h-5 w-5 text-emerald" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-text">
                    {tA(`whyUsCards.${key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {tA(`whyUsCards.${key}Body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ParallaxAboutDivider() {
  const t = useTranslations("parallax");
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const SUPABASE_STORAGE_URL =
    "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

  return (
    <section
      ref={ref}
      className="relative h-[50vh] md:h-[60vh] overflow-hidden flex items-center"
    >
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={`${SUPABASE_STORAGE_URL}/jungle/wildlife-sloth-01.jpg`}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-bg/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-bg/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg/30" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        style={{ opacity, y: textY }}
      >
        <div className="flex gap-6 md:gap-10">
          <div className="hidden md:flex flex-col items-center gap-3" aria-hidden="true">
            <div className="w-px h-12 bg-gradient-to-b from-emerald/40 to-transparent" />
            <div className="w-1 h-1 rounded-full bg-emerald" />
          </div>

          <div className="max-w-2xl">
            <Reveal>
              <p
                className="font-heading font-bold text-text leading-[1.15] tracking-[-0.02em] text-balance"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}
              >
                &ldquo;{t("heading")}&rdquo;
              </p>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-5 text-text-secondary text-[14px] md:text-[15px] leading-relaxed max-w-lg">
                {t("description")}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px w-8 bg-emerald/40" />
                <span className="font-display text-[10px] tracking-[0.2em] uppercase text-emerald/70">
                  Manuel Antonio, Costa Rica
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/15 to-transparent" />
    </section>
  );
}
