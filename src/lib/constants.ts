export type TourCategory = "day_park" | "mangrove" | "night_walk";

export const CATEGORY_STYLES: Record<
  TourCategory,
  { ring: string; dot: string; border: string; text: string; label: string }
> = {
  day_park: { ring: "ring-emerald/40", dot: "bg-emerald", border: "border-emerald/40", text: "text-emerald", label: "emerald" },
  mangrove: { ring: "ring-teal-500/40", dot: "bg-teal-500", border: "border-teal-500/40", text: "text-teal-500", label: "teal" },
  night_walk: { ring: "ring-amber-500/40", dot: "bg-amber-500", border: "border-amber-500/40", text: "text-amber-500", label: "amber" },
};

export const difficultyLabels: Record<string, Record<string, string>> = {
  es: { easy: "Fácil", moderate: "Moderada", challenging: "Exigente" },
  en: { easy: "Easy", moderate: "Moderate", challenging: "Challenging" },
};
