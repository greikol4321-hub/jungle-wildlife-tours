# Product Purpose

Jungle Wildlife Tours admin panel — internal tool for the tour operator to manage all dynamic content: create/edit tours with images, moderate reviews, and handle contact messages. Single admin user (owner). Must feel calm and competent, not distracting; the admin works here daily.

# Brand Personality

Calm, competent, nature-aligned. Voice: direct, trustworthy, zero fluff. Emotional goal: the owner opens the admin and immediately knows where things stand — no cognitive overhead, no "where is that button?"

# Anti-references

- Generic SaaS dashboards with card grids, neon accents, heavy sidebars
- Material Design / Bootstrap defaults that look like every other internal tool
- Data-tables that feel like spreadsheets, not curated lists
- "AI purple" gradients, glassmorphism everywhere, motion for motion's sake
- Cluttered headers with 5+ nav items, breadcrumbs on every page, redundant filters

# Design Principles

1. **Content-first density** — tables and lists breathe; the data is the UI. No cards when a clean row works better.
2. **One accent, locked** — emerald (#4ECB71) is the only action color. Used for primary CTAs, active nav, focus rings, selected states. Never a second accent.
3. **Dark, grounded, warm neutrals** — background #0B1A0F (deep forest), surface #142318, elevated #1A2E1C. Text #E8E4DC (warm off-white). Muted text at 55% opacity. No pure black, no pure white.
4. **Shape consistency** — all interactive corners at 12px (Tailwind `rounded-xl`). No mix of pills, squares, and rounded rects on the same screen.
5. **Motion is feedback, not decoration** — hover/focus transitions at 150-200ms ease-out. Page transitions instant. No infinite loops, no parallax, no scroll-jacking.
6. **Empty states teach** — every empty table shows a one-line prompt + a CTA to create the first item. Never "No data found."

# Accessibility & Inclusion

- WCAG AA minimum (4.5:1 body text, 3:1 large text). Target AAA for body where feasible.
- Focus visible: 2px solid emerald, 2px offset. Never rely on browser defaults.
- Color never sole information carrier — badges have text labels, status icons have text.
- `prefers-reduced-motion` respected: all transitions collapse to instant.
- Keyboard-first: every action reachable via Tab/Enter. No drag-only or hover-only actions.
- Screen-reader labels on icon-only buttons (logout, toggle, delete).

# Register

product