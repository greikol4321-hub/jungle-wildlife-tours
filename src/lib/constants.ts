export const SUPABASE_STORAGE_URL =
  "https://pxujzdhvftpzupaszzna.supabase.co/storage/v1/object/tour-images";

export const TOUR_CATEGORIES = ["day_park", "mangrove", "night_walk"] as const;

export type TourCategory = (typeof TOUR_CATEGORIES)[number];

export const CATEGORY_STYLES: Record<
  TourCategory,
  { ring: string; dot: string; border: string; text: string; label: string }
> = {
  day_park: { ring: "ring-emerald/40", dot: "bg-emerald", border: "border-emerald/40", text: "text-emerald", label: "emerald" },
  mangrove: { ring: "ring-cyan/40", dot: "bg-cyan", border: "border-cyan/40", text: "text-cyan", label: "cyan" },
  night_walk: { ring: "ring-violet/40", dot: "bg-violet", border: "border-violet/40", text: "text-violet", label: "violet" },
};

export const difficultyLabels: Record<string, Record<string, string>> = {
  es: { easy: "Fácil", moderate: "Moderada", challenging: "Exigente" },
  en: { easy: "Easy", moderate: "Moderate", challenging: "Challenging" },
};
