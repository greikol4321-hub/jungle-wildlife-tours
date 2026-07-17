{
  "identity": {
    "name": "Jungle Wildlife Tours Admin",
    "tone": "calm, competent, nature-aligned",
    "register": "product"
  },
  "palette": {
    "strategy": "committed",
    "mode": "dark",
    "tokens": {
      "bg": { "oklch": "0.145 0.02 160", "hex": "#0B1A0F", "role": "page background" },
      "bg-warm": { "oklch": "0.155 0.025 160", "hex": "#0E1C11", "role": "hover / subtle panels" },
      "surface": { "oklch": "0.18 0.025 160", "hex": "#142318", "role": "cards, tables, main containers" },
      "surface-elevated": { "oklch": "0.22 0.025 160", "hex": "#1A2E1C", "role": "dropdowns, modals, popovers" },
      "surface-hover": { "oklch": "0.25 0.025 160", "hex": "#1F3522", "role": "interactive hover" },
      "border": { "oklch": "0.45 0.015 85 / 0.08", "hex": "rgba(212,197,160,0.08)", "role": "hairline borders" },
      "border-strong": { "oklch": "0.5 0.02 85 / 0.14", "hex": "rgba(212,197,160,0.14)", "role": "focus rings, active borders" },
      "border-hover": { "oklch": "0.65 0.15 150 / 0.35", "hex": "rgba(78,203,113,0.35)", "role": "interactive hover border" },
      "text": { "oklch": "0.92 0.01 85", "hex": "#E8E4DC", "role": "primary body text" },
      "text-secondary": { "oklch": "0.72 0.01 85", "hex": "rgba(232,228,220,0.55)", "role": "secondary / helper text" },
      "text-muted": { "oklch": "0.55 0.01 85", "hex": "rgba(232,228,220,0.3)", "role": "placeholders, disabled, meta" },
      "emerald": { "oklch": "0.7 0.2 150", "hex": "#4ECB71", "role": "primary accent — CTAs, active nav, focus rings, selected rows" },
      "emerald-bright": { "oklch": "0.78 0.2 150", "hex": "#6DD98A", "role": "primary hover" },
      "emerald-dim": { "oklch": "0.7 0.2 150 / 0.1", "hex": "rgba(78,203,113,0.1)", "role": "subtle accent backgrounds" },
      "emerald-glow": { "oklch": "0.7 0.2 150 / 0.18", "hex": "rgba(78,203,113,0.18)", "role": "focus ring shadow" },
      "sand": { "oklch": "0.72 0.08 85", "hex": "#D4C5A0", "role": "warm accent (secondary actions only)" },
      "sand-dim": { "oklch": "0.72 0.08 85 / 0.08", "hex": "rgba(212,197,160,0.08)", "role": "sand accent backgrounds" },
      "sand-glow": { "oklch": "0.72 0.08 85 / 0.15", "hex": "rgba(212,197,160,0.15)", "role": "sand focus" },
      "canopy": { "oklch": "0.35 0.08 150", "hex": "#2D5A3D", "role": "deep green for subtle patterns" },
      "canopy-deep": { "oklch": "0.22 0.08 150", "hex": "#1A3D28", "role": "deepest green" }
    }
  },
  "typography": {
    "fonts": {
      "heading": { "family": "Cormorant Garamond", "weights": [400, 500, 600, 700], "variable": "--font-heading" },
      "body": { "family": "Outfit", "weights": [300, 400, 500, 600, 700], "variable": "--font-body" },
      "mono": { "family": "Space Mono", "weights": [400, 700], "variable": "--font-mono" },
      "display": { "family": "Syne", "weights": [400, 500, 600, 700, 800], "variable": "--font-display" }
    },
    "scale": {
      "display": { "clamp": "clamp(2.5rem, 5vw, 4rem)", "letter-spacing": "-0.02em", "line-height": 1.05 },
      "h1": { "clamp": "clamp(1.75rem, 3vw, 2.5rem)", "letter-spacing": "-0.015em", "line-height": 1.1 },
      "h2": { "clamp": "clamp(1.375rem, 2.5vw, 1.75rem)", "letter-spacing": "-0.01em", "line-height": 1.15 },
      "h3": { "size": "1.125rem", "letter-spacing": "0", "line-height": 1.2 },
      "body": { "size": "1rem", "line-height": 1.65, "max-width": "65ch" },
      "small": { "size": "0.875rem", "line-height": 1.5 },
      "micro": { "size": "0.75rem", "line-height": 1.4 },
      "mono-ui": { "size": "0.625rem", "letter-spacing": "0.2em", "text-transform": "uppercase", "font-weight": 600 }
    },
    "balance": {
      "headings": "text-wrap: balance",
      "prose": "text-wrap: pretty"
    }
  },
  "spacing": {
    "scale": [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
    "section": { "py": 48, "mobile-py": 32 },
    "card-gap": 16,
    "inline-gap": 12
  },
  "radius": {
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20,
    "pill": 9999,
    "default-interactive": 12
  },
  "shadows": {
    "card": "0 4px 24px -4px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,197,160,0.04)",
    "card-hover": "0 12px 48px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(78,203,113,0.15)",
    "glow-emerald": "0 0 40px -10px rgba(78,203,113,0.25)",
    "glow-sand": "0 0 40px -10px rgba(212,197,160,0.15)",
    "focus-ring": "0 0 0 2px var(--color-emerald)",
    "dropdown": "0 8px 32px -8px rgba(0,0,0,0.5)"
  },
  "motion": {
    "easings": {
      "out": "cubic-bezier(0.22, 1, 0.32, 1)",
      "spring": "cubic-bezier(0.32, 0.72, 0, 1)",
      "snappy": "cubic-bezier(0.16, 1, 0.3, 1)",
      "smooth": "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    "durations": {
      "instant": 0,
      "fast": 100,
      "normal": 180,
      "slow": 280
    },
    "reduced-motion": "respect"
  },
  "components": {
    "sidebar": {
      "width": 240,
      "mobile-width": 320,
      "bg": "surface",
      "border": "border",
      "item": {
        "padding": "12px 16px",
        "radius": 12,
        "gap": 12,
        "icon-size": 20,
        "active-bg": "emerald-dim",
        "active-fg": "emerald",
        "inactive-fg": "text-secondary",
        "hover-bg": "surface-elevated",
        "hover-fg": "text"
      }
    },
    "table": {
      "header": {
        "bg": "transparent",
        "border": "border",
        "fg": "text-muted",
        "font-size": "micro",
        "padding": "12px 16px"
      },
      "row": {
        "border": "border / 50%",
        "hover-bg": "surface-elevated / 50%",
        "padding": "12px 16px",
        "transition": "all 0.15s ease-out"
      },
      "cell": {
        "fg": "text",
        "font-size": "small"
      },
      "badge": {
        "radius": "pill",
        "padding": "4px 10px",
        "font-size": "micro",
        "variants": {
          "active": { "bg": "emerald-dim", "fg": "emerald", "dot": "emerald" },
          "pending": { "bg": "rgba(255,206,0,0.1)", "fg": "#FFCE00", "dot": "#FFCE00" },
          "inactive": { "bg": "rgba(232,228,220,0.1)", "fg": "text-muted", "dot": "text-muted" }
        }
      }
    },
    "button": {
      "radius": "pill",
      "padding": { "x": 28, "y": 12 },
      "font-size": "small",
      "font-weight": 600,
      "variants": {
        "primary": { "bg": "emerald", "fg": "bg", "shadow": "0 2px 12px -2px rgba(78,203,113,0.3)", "hover-bg": "emerald-bright", "hover-shadow": "glow-emerald" },
        "secondary": { "bg": "transparent", "fg": "text", "border": "border-strong", "hover-bg": "emerald-dim", "hover-fg": "emerald", "hover-border": "border-hover" },
        "ghost": { "bg": "transparent", "fg": "text-secondary", "border": "border", "hover-border": "border-strong", "hover-fg": "text", "hover-bg": "rgba(255,255,255,0.02)" },
        "sand": { "bg": "sand", "fg": "bg", "hover-shadow": "glow-sand" },
        "destructive": { "bg": "rgba(239,68,68,0.1)", "fg": "#EF4444", "border": "rgba(239,68,68,0.2)", "hover-bg": "rgba(239,68,68,0.2)" },
        "icon": { "size": 40, "padding": 0 }
      }
    },
    "input": {
      "radius": 12,
      "padding": { "x": 12, "y": 10 },
      "font-size": "small",
      "bg": "surface-elevated",
      "border": "border",
      "fg": "text",
      "placeholder": "text-muted",
      "focus-border": "emerald",
      "focus-ring": "focus-ring"
    },
    "select": {
      "trigger": "input",
      "content": { "bg": "surface-elevated", "border": "border", "radius": 12, "shadow": "dropdown" },
      "item": { "padding": "8px 12px", "radius": 8, "hover-bg": "emerald-dim", "hover-fg": "emerald", "checked-bg": "emerald-dim", "checked-fg": "emerald" }
    },
    "badge": {
      "radius": "pill",
      "padding": { "x": 10, "y": 4 },
      "font-size": "micro",
      "font-weight": 600
    },
    "card": {
      "radius": 20,
      "bg": "surface",
      "border": "border",
      "shadow": "card",
      "hover-border": "border-hover",
      "hover-shadow": "card-hover",
      "padding": 20
    },
    "dialog": {
      "radius": 20,
      "bg": "surface",
      "border": "border",
      "shadow": "card-hover",
      "padding": 24,
      "max-width": 480
    },
    "dropdown": {
      "radius": 12,
      "bg": "surface-elevated",
      "border": "border",
      "shadow": "dropdown",
      "item-radius": 8
    }
  },
  "layout": {
    "max-width": 1400,
    "container-padding": { "mobile": 16, "desktop": 32 },
    "header-height": 56,
    "sidebar-width": 240,
    "mobile-sidebar-width": 320
  },
  "accessibility": {
    "contrast": "AA",
    "target-contrast": "AAA-body",
    "focus-visible": "2px solid var(--color-emerald) / 2px offset",
    "color-not-sole-carrier": true,
    "reduced-motion": "collapse-to-instant"
  },
  "icons": {
    "library": "lucide-react",
    "stroke-width": 1.5,
    "size-default": 20,
    "size-lg": 24,
    "size-sm": 16
  },
  "forms": {
    "label-above": true,
    "helper-text": true,
    "error-below": true,
    "gap": 8,
    "required-mark": "asterisk"
  },
  "empty-states": {
    "show-prompt": true,
    "show-cta": true,
    "pattern": "one-line description + primary action"
  },
  "anti-patterns": {
    "no-center-bias": true,
    "no-cards-when-rows-work": true,
    "no-nested-cards": true,
    "no-gradient-text": true,
    "no-glassmorphism-default": true,
    "no-hero-metric-template": true,
    "no-identical-card-grids": true,
    "no-eyebrow-on-every-section": true,
    "no-numbered-section-markers": true,
    "no-text-overflow": true,
    "no-side-stripe-borders": true,
    "no-pure-black-white": true,
    "no-lila-default": true,
    "no-cream-default": true,
    "no-fake-precision-numbers": true
  }
}