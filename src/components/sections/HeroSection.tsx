"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { motion, useScroll, useSpring, useMotionValue, useTransform } from "motion/react";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("hero");
  const SUPABASE_STORAGE_URL =
    "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven parallax on the background image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  // Mouse-tracking parallax (desktop only)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 50, damping: 20, mass: 0.5 };
  const mouseParallaxX = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), springConfig);
  const mouseParallaxY = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
      aria-labelledby="hero-title"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image — scroll + mouse parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ x: mouseParallaxX, y: mouseParallaxY }}
        >
          <Image
            src={`${SUPABASE_STORAGE_URL}/jungle-canopy-01.jpg`}
            alt="Dosel de selva tropical en Manuel Antonio al amanecer"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Gradient Blend — cinematic bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/40 via-transparent to-transparent" />

      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_50%_40%_at_25%_45%,var(--color-emerald-dim)_0%,transparent_70%)]" />
      </div>

      {/* Grid Pattern with Mask */}
      <div className="absolute inset-0 opacity-10 hero-grid-mask" aria-hidden="true">
        <div className="absolute inset-0 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:90px_90px]" />
      </div>

      {/* Content — fades on scroll */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-36 sm:px-6 lg:px-8"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <Reveal delay={150}>
          <p className="font-mono text-xs font-medium tracking-[0.25em] text-emerald uppercase">
            {t("eyebrow")}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <h1
            id="hero-title"
            className="mt-4 font-heading font-bold text-white leading-[0.92] tracking-[-0.03em] text-balance"
            style={{ fontSize: "clamp(3.8rem, 9vw, 7.5rem)" }}
          >
            {t("title")}
          </h1>
        </Reveal>

        <Reveal delay={450}>
          <p className="mt-6 max-w-xl text-lg font-light text-text-secondary leading-[1.8]">
            {t("description")}
          </p>
        </Reveal>

        <Reveal delay={600}>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href="/tours" className="btn-magnetic-primary group">
              <span className="relative z-10">{t("primaryCta")}</span>
              <span className="absolute inset-0 rounded-full bg-emerald opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" aria-hidden="true" />
            </Link>
            <a
              href="https://wa.me/50688888888"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic-outline"
              aria-label={t("secondaryCta")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("secondaryCta")}
            </a>
          </div>
        </Reveal>

        {/* Trust indicator strip */}
        <Reveal delay={800}>
          <div className="mt-16 flex flex-wrap items-center gap-6 text-text-secondary/60">
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-emerald">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-dot" aria-hidden="true" />
              Guía certificado ICT
            </div>
            <div className="w-px h-4 bg-border" aria-hidden="true" />
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-gold">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Inscrito Hacienda & CCSS
            </div>
            <div className="w-px h-4 bg-border" aria-hidden="true" />
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-lime">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Manuel Antonio, Costa Rica
            </div>
          </div>
        </Reveal>
      </motion.div>

      {/* Scroll indicator */}
      <Reveal delay={1000}>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary/40">
          <svg className="h-5 w-5 animate-bounce [animation-duration:2s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="font-mono text-[10px] tracking-widest uppercase">Explorar</span>
        </div>
      </Reveal>
    </section>
  );
}
