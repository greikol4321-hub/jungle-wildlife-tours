"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "motion/react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        setVisible(window.scrollY > 400);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 right-6 z-50 inline-flex items-center justify-center rounded-full bg-emerald p-3.5 text-bg shadow-lg transition-colors duration-300 hover:bg-emerald-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald shadow-[0_4px_20px_-4px_rgba(78,203,113,0.3)]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </m.button>
      )}
    </AnimatePresence>
  );
}
