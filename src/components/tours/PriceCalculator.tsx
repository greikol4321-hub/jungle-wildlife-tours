"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";

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
  return locale === "es" ? `${lower}-${childMaxAge} años` : `${lower}-${childMaxAge} years`;
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
  const t = useTranslations("tourDetail");
  const reducedMotion = useReducedMotion() ?? false;
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const childPrice = childPriceUsd ?? 0;
  const ivaRate = 0.13;
  const total = adults * priceUsd + children * childPrice;
  const ivaAmount = total * ivaRate;
  const totalWithIva = total + ivaAmount;

  const generalLabel = "General";
  const childLabel = childMaxAge && minAge != null ? childAgeLabel(minAge, childMaxAge, locale) : t("child");
  const showAgeRange = childMaxAge && minAge != null && childMaxAge > 2;

  const whatsappText =
    locale === "es"
      ? `¡Hola! Quiero consultar disponibilidad para el tour: ${title}. Fecha: ${date}. Adultos: ${adults}, Niños: ${children}. Total estimado (${paymentMethod === "card" ? "tarjeta" : "efectivo"}): $${paymentMethod === "card" ? totalWithIva.toFixed(0) : total.toFixed(0)}`
      : `Hi! I'd like to check availability for the tour: ${title}. Date: ${date}. Adults: ${adults}, Children: ${children}. Estimated total (${paymentMethod === "card" ? "card" : "cash"}): $${paymentMethod === "card" ? totalWithIva.toFixed(0) : total.toFixed(0)}`;

  const whatsappNumberFallback = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50684230485";

  function handleBook() {
    window.open(`https://wa.me/${whatsappNumberFallback}?text=${encodeURIComponent(whatsappText)}`, "_blank");
  }

  const tariffItems = useMemo(() => {
    const items: Array<{ label: string; price: number; isGeneral: boolean; isFree?: boolean }> = [
      { label: generalLabel, price: priceUsd, isGeneral: true },
      { label: childLabel ?? t("child"), price: childPrice, isGeneral: false },
    ];
    if (childPriceUsd && childMaxAge && (minAge === undefined || minAge === null || minAge <= 0)) {
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

            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-widest uppercase text-text-muted mb-3">{t("paymentMethod")}</p>
              <div className="flex gap-2">
                {(["cash", "card"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 py-2.5 rounded-xl font-mono text-[11px] tracking-wider uppercase transition-all duration-200 border ${
                      paymentMethod === method
                        ? "bg-emerald/10 border-emerald/40 text-emerald font-semibold"
                        : "bg-surface border-border text-text-secondary hover:border-emerald/30 hover:text-emerald/80"
                    }`}
                  >
                    {t(method)}
                    {method === "card" && <span className="block text-[9px] tracking-wider opacity-70">+13% IVA</span>}
                  </button>
                ))}
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
                {paymentMethod === "card" ? (
                  <>
                    <p className="font-mono text-3xl font-bold text-sand tabular-nums leading-none">${totalWithIva.toFixed(0)}</p>
                    <p className="font-mono text-[10px] tracking-wider text-text-muted/70 mt-1">${total.toFixed(0)} + ${ivaAmount.toFixed(0)} {t("ivaLine")}</p>
                  </>
                ) : (
                  <p className="font-mono text-3xl font-bold text-sand tabular-nums leading-none">${total.toFixed(0)}</p>
                )}
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
          <label className="relative group block">
            <p className="font-mono text-[11px] tracking-widest uppercase text-text-muted mb-2">
              {locale === "es" ? "Seleccioná la fecha para consultar disponibilidad" : "Select a date to check availability"}
            </p>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-emerald transition-colors pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="admin-input w-full pl-10 pr-4 py-3 text-text [color-scheme:dark]"
                required
              />
            </div>
          </label>
          <button
            type="button"
            onClick={handleBook}
            className="btn btn-primary w-full py-3.5 relative overflow-hidden"
            style={{
              transition: reducedMotion
                ? "transform 80ms ease-out, background-color 80ms ease-out"
                : "transform 120ms cubic-bezier(0.23, 1, 0.32, 1), background-color 120ms cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("bookThisTour")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}