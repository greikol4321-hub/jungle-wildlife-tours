"use client";

import { useState, useCallback, useEffect, useEffectEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { m, AnimatePresence, LayoutGroup } from "motion/react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryHero } from "@/components/gallery/GalleryHero";


type GalleryImage = {
  id: string;
  storage_path: string;
  alt_text_es?: string;
  alt_text_en?: string;
  tours: {
    slug: string;
    title_es: string;
    title_en: string;
    category: string;
  } | null;
};



export function GalleryContent({ images, locale }: { images: GalleryImage[]; locale: string }) {
  const t = useTranslations("gallery");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const categories = [...new Set(images.flatMap((img) => img.tours?.category ? [img.tours.category] : []))] as string[];
  const filtered = activeCat ? images.filter((img) => img.tours?.category === activeCat) : images;

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(() => {
    if (selected === null) return;
    setSelected((selected - 1 + filtered.length) % filtered.length);
  }, [selected, filtered.length]);
  const next = useCallback(() => {
    if (selected === null) return;
    setSelected((selected + 1) % filtered.length);
  }, [selected, filtered.length]);

  useEffect(() => { setSelected(null); }, [activeCat]);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  useEffect(() => {
    if (selected === null) return;
    const handler = (e: KeyboardEvent) => onKeyDown(e);
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const tourTitle = (tour: { title_es: string; title_en: string }) =>
    locale === "es" ? tour.title_es : tour.title_en;

  return (
    <>
      <GalleryHero />

      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-12" aria-hidden="true">
            <div className="h-px w-12 bg-gradient-to-r from-emerald/30 to-transparent" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald/40" />
            <div className="h-px flex-1 bg-gradient-to-r from-emerald/20 to-transparent" />
          </div>

          <Reveal>
            <h2
              className="font-heading font-bold tracking-tight text-text"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}
            >
              {locale === "es" ? "Explorá la galería" : "Explore the gallery"}
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-3 text-text-secondary text-[15px] leading-relaxed max-w-lg">
              {t("subtitle")}
            </p>
          </Reveal>

          {categories.length > 0 && (
            <Reveal delay={120}>
              <LayoutGroup>
                <div className="mt-8 flex flex-wrap gap-2">
                  <m.button
                    onClick={() => setActiveCat(null)}
                    className={`relative px-4 py-2 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all duration-300 ${
                      activeCat === null
                        ? "text-bg"
                        : "bg-surface text-text-secondary border border-border hover:border-emerald/30 hover:text-text"
                    }`}
                    whileTap={{ scale: 0.97 }}
                  >
                    {activeCat === null && (
                      <m.span
                        layoutId="gallery-filter-bg"
                        className="absolute inset-0 rounded-full bg-emerald"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-[1]">
                      {locale === "es" ? "Todas" : "All"}
                    </span>
                  </m.button>
                  {categories.map((cat) => (
                    <m.button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      className={`relative px-4 py-2 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all duration-300 ${
                        activeCat === cat
                          ? "text-bg"
                          : "bg-surface text-text-secondary border border-border hover:border-emerald/30 hover:text-text"
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      {activeCat === cat && (
                        <m.span
                          layoutId="gallery-filter-bg"
                          className="absolute inset-0 rounded-full bg-emerald"
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative z-[1]">
                        {locale === "es"
                          ? ({ day_park: "Día", mangrove: "Manglar", night_walk: "Nocturno" }[cat] ?? cat)
                          : ({ day_park: "Day", mangrove: "Mangrove", night_walk: "Night" }[cat] ?? cat)}
                      </span>
                    </m.button>
                  ))}
                </div>
              </LayoutGroup>
            </Reveal>
          )}

          {filtered.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((image, i) => {
                  const alt = locale === "es" ? image.alt_text_es : image.alt_text_en;
                  const caption = image.tours ? tourTitle(image.tours) : null;
                  return (
                    <m.div
                      key={image.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: (i % 8) * 0.04 }}
                    >
                      <Reveal delay={160 + (i % 8) * 30}>
                        <button
                          type="button"
                          onClick={() => setSelected(i)}
                          className="group relative rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:border-emerald/30 hover:shadow-glow-emerald cursor-pointer text-left w-full aspect-[4/3]"
                        >
                          <Image
                            src={image.storage_path}
                            alt={alt || "Gallery photo"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                            {image.tours?.category && (
                              <span
                                className={`self-start mb-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border ${({ day_park: "bg-emerald/15 text-emerald border-emerald/25", mangrove: "bg-cyan-500/15 text-cyan-400 border-cyan-400/25", night_walk: "bg-purple-500/15 text-purple-400 border-purple-400/25" })[image.tours.category] || "bg-white/10 text-white/70 border-white/20"}`}
                              >
                                {locale === "es"
                                  ? ({ day_park: "Día", mangrove: "Manglar", night_walk: "Nocturno" }[image.tours.category] ?? image.tours.category)
                                  : ({ day_park: "Day", mangrove: "Mangrove", night_walk: "Night" }[image.tours.category] ?? image.tours.category)}
                              </span>
                            )}
                            {caption && (
                              <p className="text-xs font-medium text-white/90 leading-snug">
                                {caption}
                              </p>
                            )}
                          </div>
                        </button>
                      </Reveal>
                    </m.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <Reveal delay={160}>
              <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-8 py-20 text-center">
                <Camera className="mb-4 h-10 w-10 text-text-secondary/40" strokeWidth={1.2} />
                <p className="text-sm text-text-secondary">{t("mangroveComingSoon")}</p>
                <p className="mt-2 text-xs text-text-secondary/60">{t("mangroveNote")}</p>
              </div>
            </Reveal>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selected !== null && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={close}
            role="presentation"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2} />
                </button>
              </>
            )}

            <div
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
              role="presentation"
            >
              <Image
                src={filtered[selected].storage_path}
                alt={locale === "es" ? (filtered[selected].alt_text_es ?? "Gallery photo") : (filtered[selected].alt_text_en ?? "Gallery photo")}
                width={1200}
                height={900}
                className="h-auto w-auto max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
                priority
              />
              <p className="absolute bottom-0 left-0 right-0 text-center text-xs text-white/50 py-3">
                {selected + 1} / {filtered.length}
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
