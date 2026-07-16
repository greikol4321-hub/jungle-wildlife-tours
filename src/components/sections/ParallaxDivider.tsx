"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";

interface ParallaxDividerProps {
  locale: string;
}

export function ParallaxDivider({ locale }: ParallaxDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("parallax");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const SUPABASE_STORAGE_URL =
    "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

  return (
    <section
      ref={ref}
      className="relative h-[50vh] md:h-[60vh] overflow-hidden flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={`${SUPABASE_STORAGE_URL}/wildlife-sloth-01.jpg`}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Overlays — clean, minimal */}
      <div className="absolute inset-0 bg-bg/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-xl mx-auto"
        style={{ opacity, y: textY }}
      >
        <Reveal>
          <h2
            className="font-heading font-bold text-text leading-[1.1] tracking-[-0.02em] text-balance"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            {t("heading")}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-4 max-w-md mx-auto text-text-secondary text-sm leading-relaxed">
            {t("description")}
          </p>
        </Reveal>
      </motion.div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/15 to-transparent" />
    </section>
  );
}
