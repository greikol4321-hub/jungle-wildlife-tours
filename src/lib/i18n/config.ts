export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
const defaultLocale: Locale = "es";
