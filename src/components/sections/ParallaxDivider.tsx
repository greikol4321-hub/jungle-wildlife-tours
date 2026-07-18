"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";


interface ParallaxDividerProps {
  locale?: string;
  imageSrc?: string;
}

export function ParallaxDivider({ locale = "en", imageSrc = "terrestre/wildlife-sloth-01.jpg" }: ParallaxDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("parallax");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={ref}
      className="relative h-[55vh] md:h-[65vh] overflow-hidden flex items-center"
      aria-label={t("heading")}
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
            src={imageSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-bg/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-bg/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg/30" />

      {/* Content — editorial pull-quote style */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        style={{ opacity, y: textY }}
      >
        <div className="flex gap-6 md:gap-10">
          {/* Vertical accent */}
          <div className="hidden md:flex flex-col items-center gap-3" aria-hidden="true">
            <div className="w-px h-12 bg-gradient-to-b from-emerald/40 to-transparent" />
            <div className="w-1 h-1 rounded-full bg-emerald" />
          </div>

          <div className="max-w-2xl">
            <Reveal>
              <p className="font-heading font-bold text-text leading-[1.15] tracking-[-0.02em] text-balance"
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

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/15 to-transparent" />
    </section>
  );
}
