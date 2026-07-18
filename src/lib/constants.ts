export const TOUR_CATEGORIES = ["day_park", "mangrove", "night_walk"] as const;

export type TourCategory = (typeof TOUR_CATEGORIES)[number];

export const CATEGORY_STYLES: Record<
  TourCategory,
  { ring: string; dot: string; border: string; text: string; label: string }
> = {
  day_park: { ring: "ring-emerald/40", dot: "bg-emerald", border: "border-emerald/40", text: "text-emerald", label: "emerald" },
  mangrove: { ring: "ring-cyan-500/40", dot: "bg-cyan-500", border: "border-cyan-500/40", text: "text-cyan-500", label: "cyan" },
  night_walk: { ring: "ring-violet-500/40", dot: "bg-violet-500", border: "border-violet-500/40", text: "text-violet-500", label: "violet" },
};

export const difficultyLabels: Record<string, Record<string, string>> = {
  es: { easy: "Fácil", moderate: "Moderada", challenging: "Exigente" },
  en: { easy: "Easy", moderate: "Moderate", challenging: "Challenging" },
};
