"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { saveBookingLead } from "@/app/actions/booking-lead";

interface Props {
  priceUsd: number;
  title: string;
  childPricePct: number;
  childPriceUsd?: number;
  locale: string;
  tourId?: string;
}

function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  price,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  price: number;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-widest uppercase text-text-muted mb-2">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-elevated border border-border text-text-secondary hover:border-emerald/40 hover:text-emerald hover:bg-emerald-dim transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <span className="font-mono text-2xl font-bold text-text w-8 text-center tabular-nums leading-none">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-elevated border border-border text-text-secondary hover:border-emerald/40 hover:text-emerald hover:bg-emerald-dim transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
      <p className="mt-1.5 font-mono text-[10px] tracking-wider text-text-muted">
        ${price.toFixed(0)} × {value}
      </p>
    </div>
  );
}

export function PriceCalculator({
  priceUsd,
  title,
  childPricePct,
  childPriceUsd,
  locale,
  tourId,
}: Props) {
  const t = useTranslations("tourDetail");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const childPrice = childPriceUsd ?? priceUsd * (childPricePct / 100);
  const total = adults * priceUsd + children * childPrice;

  const whatsappText =
    locale === "es"
      ? `¡Hola! Quiero reservar el tour: ${title}. Adultos: ${adults}, Niños: ${children}. Total estimado: $${total}`
      : `Hi! I'd like to book the tour: ${title}. Adults: ${adults}, Children: ${children}. Estimated total: $${total}`;

  const whatsappNumberFallback = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50688888888";

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
      window.open(`https://wa.me/${whatsappNumberFallback}?text=${encodeURIComponent(whatsappText)}`, "_blank");
    } catch {
      alert("Error al guardar. Abriendo WhatsApp de todos modos.");
      window.open(`https://wa.me/${whatsappNumberFallback}?text=${encodeURIComponent(whatsappText)}`, "_blank");
    }
    setSaving(false);
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald" aria-hidden="true">
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
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-xl bg-surface border border-border px-4 py-3">
            <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted">{t("tariff")}</span>
            <span className="font-mono text-sm font-bold text-text">
              {t("adult")} <span className="text-sand">${priceUsd}</span>
            </span>
            <span className="font-mono text-sm font-bold text-text">
              {t("child")} <span className="text-sand">${childPrice.toFixed(0)}</span>
            </span>
            {childPriceUsd && (
              <>
                <span className="text-[10px] text-text-muted">|</span>
                <span className="font-mono text-[10px] tracking-wider text-text-muted">{t("freeUnder2")}</span>
              </>
            )}
            <span className="text-[10px] text-text-muted">|</span>
            <span className="font-mono text-[10px] tracking-wider text-emerald">{t("cashPrice")}</span>
          </div>

          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <Stepper label={t("adults")} value={adults} onChange={setAdults} min={1} max={20} price={priceUsd} />
            <Stepper label={t("children")} value={children} onChange={setChildren} min={0} max={20} price={childPrice} />
          </div>

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
            <div className="text-sm text-text-secondary leading-relaxed">
              <p>{adults} {t("adultLabel")} × ${priceUsd}</p>
              {children > 0 && <p>{children} {t("childLabel")} × ${childPrice.toFixed(0)}</p>}
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] tracking-widest uppercase text-text-muted">{t("totalLabel")}</p>
              <p className="font-mono text-xl font-bold text-sand tabular-nums">${total.toFixed(0)}</p>
            </div>
          </div>
        </>
      )}

      {priceUsd === 0 && (
        <div className="mt-6 rounded-xl bg-surface border border-border px-4 py-6 text-center">
          <p className="font-heading text-xl text-text mb-1">{t("askPrice")}</p>
          <p className="text-sm text-text-secondary">{t("askPriceSub")}</p>
        </div>
      )}

      <div className="mt-5 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={locale === "es" ? "Tu nombre" : "Your name"}
          className="admin-input w-full"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={locale === "es" ? "Tu WhatsApp (con código de país)" : "Your WhatsApp (with country code)"}
          className="admin-input w-full"
          required
        />
        <button
          onClick={handleBook}
          disabled={saving || !name.trim() || !phone.trim()}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? t("saving") ?? "Guardando..." : t("bookThisTour")}
        </button>
      </div>
    </div>
  );
}
