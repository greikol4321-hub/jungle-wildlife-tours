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
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const SUPABASE_STORAGE_URL =
    "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

  return (
    <section
      ref={ref}
      className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center"
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

      {/* Overlays */}
      <div className="absolute inset-0 bg-bg/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/50 via-transparent to-bg/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(78,203,113,0.06)_0%,transparent_60%)]" />

      {/* Animated diamond */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80px] z-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-1.5 h-1.5 rotate-45 bg-emerald/40" />
      </motion.div>

      {/* Content */}
      <motion.div className="relative z-10 text-center px-4 max-w-2xl mx-auto" style={{ opacity, y: textY }}>
        {/* Eyebrow with decorative lines */}
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-10 bg-emerald/30" />
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-emerald">
              {locale === "es" ? "Experiencia salvaje" : "Wild experience"}
            </p>
            <span className="h-px w-10 bg-emerald/30" />
          </div>
        </Reveal>

        {/* Title */}
        <Reveal delay={150}>
          <h2
            className="font-heading font-bold text-text leading-[1.05] tracking-[-0.02em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {locale === "es"
              ? "Donde la naturaleza dicta el ritmo"
              : "Where nature sets the pace"}
          </h2>
        </Reveal>

        {/* Description */}
        <Reveal delay={300}>
          <p className="mt-4 max-w-md mx-auto text-text-secondary text-[15px] leading-relaxed">
            {locale === "es"
              ? "Cada tour es una inmersión en un ecosistema vivo."
              : "Each tour is an immersion into a living ecosystem."}
          </p>
        </Reveal>

        {/* Flanking emerald lines */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-emerald/25" />
          <span className="w-1 h-1 rounded-full bg-emerald/30" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-emerald/25" />
        </div>
      </motion.div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />
    </section>
  );
}
