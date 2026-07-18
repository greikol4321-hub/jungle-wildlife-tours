"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { m, AnimatePresence } from "motion/react";

const faqKeys = [
  "whatBring",
  "transportIncluded",
  "canChildren",
  "whatWildlife",
  "ifRains",
  "beginnerFriendly",
] as const;

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function FAQSection({ locale }: { locale: string }) {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative section-gradient-top" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <Reveal delay={60}>
          <h2 id="faq-heading" className="font-heading font-extrabold tracking-tight text-text text-center text-balance" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            {t("title")}
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-6 mb-12 flex items-center justify-center gap-3" aria-hidden="true">
            <div className="h-px w-12 bg-gradient-to-r from-emerald/40 to-transparent" />
            <div className="h-1 w-1 rounded-full bg-emerald/60" />
            <div className="h-px w-12 bg-gradient-to-l from-emerald/40 to-transparent" />
          </div>
        </Reveal>

        <div className="mt-0 space-y-3">
          {faqKeys.map((key, i) => {
            const isOpen = openIndex === i;

            return (
              <Reveal key={key} delay={80 + i * 40}>
                <div className="rounded-xl border border-border bg-surface/50 backdrop-blur-sm transition-colors duration-300 hover:border-border-hover">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm md:text-[15px] font-medium text-text">
                      {t(key)}
                    </span>
                    <ChevronDown open={isOpen} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        initial={{ gridTemplateRows: "0fr", opacity: 0 }}
                        animate={{ gridTemplateRows: "1fr", opacity: 1 }}
                        exit={{ gridTemplateRows: "0fr", opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="grid overflow-hidden"
                      >
                        <div className="min-h-0">
                          <div className="px-5 pb-4 md:px-6 md:pb-5">
                            <p className="text-sm text-text-secondary leading-relaxed max-w-prose">
                              {t(`${key}Answer`)}
                            </p>
                          </div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
