"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useParallaxMouse, useParallaxTransform } from "@/hooks/useParallaxMouse";
import { SUPABASE_STORAGE_URL } from "@/lib/constants";

const particles = [
  { top: "15%", left: "6%", size: 3, color: "bg-emerald", opacity: "opacity-20", delay: 0 },
  { top: "50%", right: "12%", size: 2, color: "bg-sand", opacity: "opacity-12", delay: 0.8 },
  { top: "70%", left: "20%", size: 1.5, color: "bg-emerald", opacity: "opacity-10", delay: 1.5 },
  { top: "25%", right: "30%", size: 2.5, color: "bg-emerald", opacity: "opacity-8", delay: 0.4 },
];

export function ContactHero() {
  const t = useTranslations("contact");

  const { ref, springX, springY, handleMouse } = useParallaxMouse();
  const { x: parallaxX, y: parallaxY } = useParallaxTransform(springX, springY, 10, 6);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, -50]);

  return (
    <section
      ref={ref}
      className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden"
      onMouseMove={handleMouse}
    >
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
        <motion.div className="absolute inset-0" style={{ x: parallaxX, y: parallaxY }}>
          <Image
            src={`${SUPABASE_STORAGE_URL}/jungle-canopy-01.jpg`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-bg/20 to-transparent" />

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 30% 50%, rgba(78,203,113,0.08) 0%, transparent 70%)",
        }}
      />

      {particles.map((p, i) => (
        <span
          key={i}
          className={`absolute rounded-full ${p.color} ${p.opacity} pointer-events-none`}
          aria-hidden="true"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            right: p.right,
            animation: `float ${6 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-2xl">
          <motion.p
            className="font-display text-xs font-medium tracking-[0.25em] text-emerald/80 uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Manuel Antonio · Costa Rica
          </motion.p>

          <motion.h1
            className="mt-5 font-heading font-bold tracking-[-0.03em] text-balance"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              lineHeight: 1,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-text">{t("title")}</span>
            <span className="block mt-2 text-emerald font-extrabold tracking-[-0.04em]">
              {t("heroSubtitle")}
            </span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-base md:text-lg font-light text-text-secondary leading-[1.75]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {t("subtitle")}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: contentOpacity }}
      >
        <motion.span
          className="block w-px h-5"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-emerald))",
            scaleY: useTransform(scrollYProgress, [0, 0.15], [0, 1]),
          }}
          aria-hidden="true"
        />
        <ChevronDown className="h-4 w-4 text-text-muted animate-bounce [animation-duration:2.5s]" strokeWidth={1.5} />
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/25 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
