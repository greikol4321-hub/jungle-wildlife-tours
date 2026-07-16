import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale | undefined;

  if (!locale || !locales.includes(locale)) {
    locale = "es";
  }

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});
