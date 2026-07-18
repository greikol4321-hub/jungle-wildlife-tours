"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return count;
}

const statsData = [
  { value: 5000, suffix: "+", key: "visitors" },
  { value: 150, suffix: "+", key: "species" },
  { value: 10, suffix: "+", key: "experience" },
  { value: 500, suffix: "+", key: "reviews" },
];

export function StatsSection({ locale }: { locale: string }) {
  const t = useTranslations("stats");
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative" aria-labelledby="stats-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <Reveal delay={60}>
          <h2 id="stats-heading" className="font-heading font-extrabold tracking-tight text-text text-center text-balance" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {statsData.map((stat, i) => {
            const Count = ({ value }: { value: number }) => {
              const count = useCountUp(value, 2000, inView);
              return <>{count.toLocaleString()}</>;
            };

            return (
              <Reveal key={stat.key} delay={100 + i * 80}>
                <div className="text-center">
                  <p className="font-heading font-bold text-emerald" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", lineHeight: 1 }}>
                    <Count value={stat.value} />
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-xs md:text-sm font-medium text-text-secondary tracking-wide">
                    {t(stat.key)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
