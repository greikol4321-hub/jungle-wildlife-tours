"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";

interface ParallaxDividerProps {
  locale: string;
}

export function ParallaxDivider({ locale }: ParallaxDividerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const SUPABASE_STORAGE_URL =
    "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

  return (
    <section
      ref={ref}
      className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Parallax Background Image */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={`${SUPABASE_STORAGE_URL}/wildlife-sloth-01.jpg`}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-bg/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/30 via-transparent to-bg/30" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4"
        style={{ opacity, y: textY }}
      >
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-emerald mb-4">
            {locale === "es" ? "Experiencia salvaje" : "Wild experience"}
          </p>
        </Reveal>
        <Reveal delay={150}>
          <h2
            className="font-heading font-bold text-white leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {locale === "es"
              ? "Donde la naturaleza dicta el ritmo"
              : "Where nature sets the pace"}
          </h2>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-4 max-w-md mx-auto text-text-secondary/70 text-base">
            {locale === "es"
              ? "Cada tour es una inmersión en un ecosistema vivo."
              : "Each tour is an immersion into a living ecosystem."}
          </p>
        </Reveal>
      </motion.div>

      {/* Diagonal clip reveal — decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
    </section>
  );
}
