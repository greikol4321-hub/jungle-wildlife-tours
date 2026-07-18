export type TourCategory = "day_park" | "mangrove" | "night_walk";

export const CATEGORY_STYLES: Record<
  TourCategory,
  { ring: string; dot: string; border: string; text: string; label: string }
> = {
  day_park: { ring: "ring-emerald/40", dot: "bg-emerald", border: "border-emerald/40", text: "text-emerald", label: "emerald" },
  mangrove: { ring: "ring-emerald/40", dot: "bg-emerald", border: "border-emerald/40", text: "text-emerald", label: "emerald" },
  night_walk: { ring: "ring-emerald/40", dot: "bg-emerald", border: "border-emerald/40", text: "text-emerald", label: "emerald" },
};

export const difficultyLabels: Record<string, Record<string, string>> = {
  es: { easy: "Fácil", moderate: "Moderada", challenging: "Exigente" },
  en: { easy: "Easy", moderate: "Moderate", challenging: "Challenging" },
};
