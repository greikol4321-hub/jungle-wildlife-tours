"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";
import { saveBookingLead } from "@/app/actions/booking-lead";
import { useToast } from "@/components/admin/toast";

interface Props {
  priceUsd: number;
  title: string;
  childPriceUsd?: number;
  minAge?: number;
  childMaxAge?: number;
  locale: string;
  tourId?: string;
}

function childAgeLabel(minAge: number | undefined, childMaxAge: number, locale: string): string | null {
  if (minAge == null) return null;
  const lower = Math.max(2, minAge);
  return locale === "es" ? `${lower}-${childMaxAge} años` : `${lower}-${childMaxAge} yrs`;
}

function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  price,
  reducedMotion,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  price: number;
  reducedMotion: boolean;
}) {
  const [isDecrementPressed, setIsDecrementPressed] = useState(false);
  const [isIncrementPressed, setIsIncrementPressed] = useState(false);

  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  const buttonTransition = reducedMotion
    ? "transform 80ms ease-out, background-color 80ms ease-out, border-color 80ms ease-out, box-shadow 80ms ease-out"
    : "transform 120ms cubic-bezier(0.23, 1, 0.32, 1), background-color 120ms cubic-bezier(0.23, 1, 0.32, 1), border-color 120ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 120ms cubic-bezier(0.23, 1, 0.32, 1)";

  const sharedButtonStyle: React.CSSProperties = {
    transition: buttonTransition,
  };

  const baseButtonClass =
    "flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated border border-border text-text-secondary " +
    "disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.96] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

  return (
    <div style={{ opacity: reducedMotion ? 1 : undefined }} className="group">
      <p className="font-mono text-[11px] tracking-widest uppercase text-text-muted mb-2">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onMouseDown={() => setIsDecrementPressed(true)}
          onMouseUp={() => setIsDecrementPressed(false)}
          onMouseLeave={() => setIsDecrementPressed(false)}
          onTouchStart={() => setIsDecrementPressed(true)}
          onTouchEnd={() => setIsDecrementPressed(false)}
          onClick={decrement}
          disabled={value <= min}
          style={sharedButtonStyle}
          className={baseButtonClass + " hover:border-emerald/40 hover:text-emerald hover:bg-emerald-dim"}
          aria-label={`Reducir ${label}`}
          aria-pressed={isDecrementPressed}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
          </svg>
        </button>
        <span
          className="font-mono text-3xl font-bold text-text w-14 text-center tabular-nums leading-none transition-all duration-150 ease-out"
          style={{
            transform: `scale(${isDecrementPressed || isIncrementPressed ? 1.08 : 1})`,
          }}
        >
          {value}
        </span>
        <button
          type="button"
          onMouseDown={() => setIsIncrementPressed(true)}
          onMouseUp={() => setIsIncrementPressed(false)}
          onMouseLeave={() => setIsIncrementPressed(false)}
          onTouchStart={() => setIsIncrementPressed(true)}
          onTouchEnd={() => setIsIncrementPressed(false)}
          onClick={increment}
          disabled={value >= max}
          style={sharedButtonStyle}
          className={baseButtonClass + " hover:border-emerald/40 hover:text-emerald hover:bg-emerald-dim"}
          aria-label={`Aumentar ${label}`}
          aria-pressed={isIncrementPressed}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
      <p className="mt-2 font-mono text-[11px] tracking-wider text-text-muted">
        ${price.toFixed(0)} × {value}
      </p>
    </div>
  );
}

function PriceDisplay({
  label,
  price,
  isGeneral,
  className = "",
}: {
  label: string | null;
  price: number;
  isGeneral?: boolean;
  className?: string;
}) {
  return (
    <span className={`font-mono text-base font-semibold text-text flex items-center gap-2 ${className}`}>
      <span className="text-text-secondary">{label ?? ""}</span>
      <span className="text-sand tabular-nums">${price.toFixed(0)}</span>
    </span>
  );
}

function AgeRangeBadge({
  label,
  className = "",
}: {
  label: string | null;
  className?: string;
}) {
  if (!label) return null;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-emerald font-mono text-[11px] tracking-wider ${className}`}>
      {label}
    </span>
  );
}

export function PriceCalculator({
  priceUsd,
  title,
  childPriceUsd,
  minAge,
  childMaxAge,
  locale,
  tourId,
}: Props) {
  const { toast } = useToast();
  const t = useTranslations("tourDetail");
  const reducedMotion = useReducedMotion() ?? false;
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const childPrice = childPriceUsd ?? 0;
  const total = adults * priceUsd + children * childPrice;

  const generalLabel = childMaxAge ? "General" : t("adult");
  const childLabel = childMaxAge && minAge != null ? childAgeLabel(minAge, childMaxAge, locale) : t("child");
  const showAgeRange = childMaxAge && minAge != null && childMaxAge > 2;

  const whatsappText =
    locale === "es"
      ? `¡Hola! Quiero reservar el tour: ${title}. Adultos: ${adults}, Niños: ${children}. Total estimado: $${total}`
      : `Hi! I'd like to book the tour: ${title}. Adults: ${adults}, Children: ${children}. Estimated total: $${total}`;

  const whatsappNumberFallback = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50684230485";

  async function handleBook() {
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    try {
      await saveBookingLead({
        name: name.trim(),
        phone: phone.trim(),
        message: whatsappText,
        tour_id: tourId,
      });
      toast("success", locale === "es" ? "Datos guardados. Abriendo WhatsApp..." : "Saved. Opening WhatsApp...");
      window.open(`https://wa.me/${whatsappNumberFallback}?text=${encodeURIComponent(whatsappText)}`, "_blank");
    } catch {
      toast("error", locale === "es" ? "Error al guardar. Abriendo WhatsApp de todos modos." : "Error saving. Opening WhatsApp anyway.");
      window.open(`https://wa.me/${whatsappNumberFallback}?text=${encodeURIComponent(whatsappText)}`, "_blank");
    }
    setSaving(false);
  }

  const tariffItems = useMemo(() => {
    const items: Array<{ label: string; price: number; isGeneral: boolean; isFree?: boolean }> = [
      { label: generalLabel, price: priceUsd, isGeneral: true },
      { label: childLabel ?? t("child"), price: childPrice, isGeneral: false },
    ];
    if (childPriceUsd && !childMaxAge && (minAge == null || minAge <= 2)) {
      items.push({ label: t("freeUnder2"), price: 0, isGeneral: false, isFree: true });
    }
    return items;
  }, [generalLabel, childLabel, priceUsd, childPrice, childPriceUsd, childMaxAge, minAge, locale, t]);

  return (
    <div
      className="card relative overflow-hidden"
      style={{
        opacity: isMounted && !reducedMotion ? 1 : 1,
        transform: isMounted && !reducedMotion ? "translateY(0)" : "translateY(0)",
        transition: reducedMotion
          ? "none"
          : "opacity 500ms cubic-bezier(0.23, 1, 0.32, 1), transform 500ms cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald" aria-hidden="true">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <div>
            <h3 className="font-heading text-lg font-bold text-text">{t("calculator")}</h3>
            <p className="text-sm text-text-secondary">{t("calculatorSub")}</p>
          </div>
        </div>

        {priceUsd > 0 && (
          <>
            <div className="mb-6 rounded-xl bg-surface border border-border p-4 md:p-5">
              <p className="font-mono text-[10px] tracking-widest uppercase text-text-muted mb-3">{t("tariff")}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                <PriceDisplay label={generalLabel} price={priceUsd} isGeneral />
                <span className="w-px h-6 bg-border/40 mx-1" aria-hidden="true" />
                <PriceDisplay label={childLabel} price={childPrice} />
                {showAgeRange && (
                  <>
                    <span className="w-px h-6 bg-border/40 mx-1" aria-hidden="true" />
                    <AgeRangeBadge label={childLabel} />
                  </>
                )}
                {tariffItems.some((item) => item.isFree) && (
                  <>
                    <span className="w-px h-6 bg-border/40 mx-1" aria-hidden="true" />
                    <span className="font-mono text-[11px] tracking-wider text-text-muted">{t("freeUnder2")}</span>
                  </>
                )}
                <span className="w-px h-6 bg-border/40 mx-1" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-wider text-emerald font-medium">{t("cashPrice")}</span>
              </div>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <Stepper
                label={generalLabel}
                value={adults}
                onChange={setAdults}
                min={1}
                max={20}
                price={priceUsd}
                reducedMotion={reducedMotion}
              />
              <Stepper
                label={t("children")}
                value={children}
                onChange={setChildren}
                min={0}
                max={20}
                price={childPrice}
                reducedMotion={reducedMotion}
              />
            </div>

            <div className="mb-6 flex items-center justify-between gap-4 border-t border-border pt-5">
              <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-1">
                <p className="font-mono tabular-nums">
                  <span className="text-text">{adults}</span> <span className="text-text-secondary">{generalLabel}</span> × <span className="text-sand">${priceUsd}</span>
                </p>
                {children > 0 && (
                  <p className="font-mono tabular-nums">
                    <span className="text-text">{children}</span> <span className="text-text-secondary">{childLabel}</span> × <span className="text-sand">${childPrice.toFixed(0)}</span>
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-[10px] tracking-widest uppercase text-text-muted mb-1">{t("totalLabel")}</p>
                <p className="font-mono text-3xl font-bold text-sand tabular-nums leading-none">${total.toFixed(0)}</p>
              </div>
            </div>
          </>
        )}

        {priceUsd === 0 && (
          <div className="mb-6 rounded-xl bg-surface border border-border px-4 py-6 text-center">
            <p className="font-heading text-xl text-text mb-1">{t("askPrice")}</p>
            <p className="text-sm text-text-secondary">{t("askPriceSub")}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="relative group">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-emerald transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "es" ? "Tu nombre" : "Your name"}
                className="admin-input w-full pl-10 pr-4 py-3 text-text placeholder:text-text-muted"
                required
                autoComplete="name"
              />
            </label>
            <label className="relative group">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-emerald transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={locale === "es" ? "Tu WhatsApp (con código de país)" : "Your WhatsApp (with country code)"}
                className="admin-input w-full pl-10 pr-4 py-3 text-text placeholder:text-text-muted"
                required
                autoComplete="tel"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleBook}
            disabled={saving || !name.trim() || !phone.trim()}
            className="btn btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              transition: reducedMotion
                ? "transform 80ms ease-out, background-color 80ms ease-out"
                : "transform 120ms cubic-bezier(0.23, 1, 0.32, 1), background-color 120ms cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {saving ? t("saving") ?? "Guardando..." : t("bookThisTour")}
                </>
              ) : (
                t("bookThisTour")
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}