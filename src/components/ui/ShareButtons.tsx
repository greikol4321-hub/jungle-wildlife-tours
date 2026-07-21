"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  const shareLinks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${shareUrl}`)}`,
      color: "hover:text-emerald",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.814-6.293-2.176l-.44-.36-2.614.876.876-2.614-.36-.44A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-blue-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
      color: "hover:text-text",
      icon: (
        <svg fill="currentColor" height="24" width="24" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" aria-hidden="true">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
        </svg>
      ),
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent fail */ }
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label={t("share")}>
      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-text-muted mr-1">
        {t("share")}
      </span>

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-300 ${link.color} hover:border-border-hover hover:bg-emerald-dim`}
        >
          {link.icon}
        </a>
      ))}

      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? t("copied") : "Copy link"}
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-300 hover:border-border-hover hover:bg-emerald-dim hover:text-emerald"
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-emerald" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" aria-hidden="true">
            <path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}
