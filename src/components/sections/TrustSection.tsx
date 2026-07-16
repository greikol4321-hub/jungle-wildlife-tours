"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "next-intl";

interface TrustSectionProps {
  locale: string;
}

export function TrustSection({ locale }: TrustSectionProps) {
  const tTrust = useTranslations("trust");

  return (
    <section className="border-y border-border py-14" aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">
        {tTrust("title") || "Confianza y certificaciones"}
      </h2>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(
            ["certifiedGuide", "legalRegistration", "localGuide", "region"] as const
          ).map((key, index) => (
            <Reveal key={key} delay={100 + index * 100}>
              <div className="flex flex-col gap-3 p-5 border border-border rounded-[14px] transition duration-300 ease-out hover:border-border-hover hover:bg-green-dim">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-green-dim">
                  <svg className="h-4 w-4 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm font-medium leading-snug">{tTrust(`badges.${key}`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}