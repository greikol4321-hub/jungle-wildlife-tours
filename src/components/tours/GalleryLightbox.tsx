"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  storage_path: string;
  alt_es?: string;
  alt_en?: string;
}

interface Props {
  images: GalleryImage[];
  locale: string;
  title: string;
}

const SUPABASE_IMAGE_BASE =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

export function GalleryLightbox({ images, locale, title }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);

  const prev = useCallback(() => {
    setSelected((s) => (s !== null ? (s - 1 + images.length) % images.length : null));
  }, [images.length]);

  const next = useCallback(() => {
    setSelected((s) => (s !== null ? (s + 1) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (selected === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [selected, close, prev, next]);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelected(i)}
            className="group relative overflow-hidden rounded-lg border border-border transition-all duration-300 hover:border-emerald/30 hover:shadow-glow-emerald cursor-pointer text-left"
          >
            <div className="aspect-[4/3]">
              <Image
                src={`${SUPABASE_IMAGE_BASE}/${image.storage_path}`}
                alt={locale === "es" ? (image.alt_es ?? title) : (image.alt_en ?? title)}
                width={400}
                height={300}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
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

          {images.length > 1 && (
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
              src={`${SUPABASE_IMAGE_BASE}/${images[selected].storage_path}`}
              alt={locale === "es" ? (images[selected].alt_es ?? title) : (images[selected].alt_en ?? title)}
              width={1200}
              height={900}
              className="h-auto w-auto max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
              priority
            />
            <p className="absolute bottom-0 left-0 right-0 text-center text-xs text-white/50 py-3">
              {selected + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
