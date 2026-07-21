"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useParallaxMouse, useParallaxTransform } from "@/hooks/useParallaxMouse";

interface HeroSectionProps {
  locale: string;
}

const particles = [
  { top: "15%", left: "10%", size: 2, color: "bg-emerald", opacity: "opacity-15", anim: "float-slow" },
  { top: "40%", right: "12%", size: 2.5, color: "bg-sand", opacity: "opacity-10", anim: "float-med" },
  { top: "60%", left: "25%", size: 1.5, color: "bg-emerald", opacity: "opacity-10", anim: "float-fast" },
  { top: "25%", right: "30%", size: 2, color: "bg-emerald", opacity: "opacity-15", anim: "float-slow" },
];

export function HeroSection(_props: HeroSectionProps) {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const reduce = useReducedMotion();

  const { ref, springX, springY, handleMouse } = useParallaxMouse({ stiffness: 40, damping: 18, mass: 0.8 });
  const { x: mouseParallaxX, y: mouseParallaxY } = useParallaxTransform(springX, springY, 12, 8);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.05, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], reduce ? [0, 0] : [0, -50]);
  const lineOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-end overflow-hidden"
      aria-labelledby="hero-title"
      onMouseMove={handleMouse}
    >
      {/* Background Image */}
      <m.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
        <m.div className="absolute inset-0" style={{ x: mouseParallaxX, y: mouseParallaxY }}>
          <Image
            src="jungle-canopy-01.jpg"
            alt={t("heroImageAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </m.div>
      </m.div>

      {/* Dark base — ensures no raw-image bleed on mobile browsers */}
      <div className="absolute inset-0 bg-bg/60" />
      {/* Gradient stack */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/60 via-bg/20 to-bg/5" />

      {/* Emerald radial glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-10 [background:radial-gradient(ellipse_35%_30%_at_18%_40%,rgba(78,203,113,0.12)_0%,transparent_70%)]" />
      </div>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className={`absolute rounded-full ${p.color} ${p.opacity} ${p.anim} pointer-events-none`}
          aria-hidden="true"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            right: p.right,
          }}
        />
      ))}

      {/* Content */}
      <m.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-36 sm:px-6 lg:px-8"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <Reveal delay={100}>
          <p className="font-display text-xs font-medium tracking-[0.25em] text-emerald/80 uppercase">
            {t("eyebrow")}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <h1
            id="hero-title"
            className="mt-5 font-heading font-bold tracking-[-0.03em] text-balance"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              lineHeight: 1,
              textShadow: "0 2px 40px rgba(78,203,113,0.06)",
            }}
          >
            <span className="text-text">{t("title")}</span>
              <span className="block mt-1 text-emerald font-extrabold tracking-[-0.04em]">
                {t("subtitle")}
              </span>
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-6 max-w-xl text-base sm:text-lg md:text-xl font-light text-text-secondary leading-[1.75]">
            {t("description")}
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/tours" className="btn btn-primary group relative overflow-hidden">
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              {t("primaryCta")}
            </Link>
            <a
              href="https://wa.me/50684230485"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              aria-label={t("secondaryCta")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.814-6.293-2.176l-.44-.36-2.614.876.876-2.614-.36-.44A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
              {t("secondaryCta")}
            </a>
          </div>
        </Reveal>


      </m.div>

      {/* Scroll indicator with line */}
      <Reveal delay={700}>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
          <m.span
            className="block w-px h-6 origin-top"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--color-emerald))",
              scaleY: scrollYProgress,
            }}
            aria-hidden="true"
          />
          <ChevronDown className="h-4 w-4 animate-pulse" strokeWidth={1.5} aria-hidden="true" />
          <span className="font-display text-[9px] tracking-[0.2em] uppercase">{t("scrollExplore")}</span>
        </div>
      </Reveal>

      {/* Animated emerald line at bottom */}
      <m.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent"
        style={{ opacity: lineOpacity }}
        aria-hidden="true"
      />
    </section>
  );
}
