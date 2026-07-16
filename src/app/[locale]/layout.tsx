import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono, Syne } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsappFloatButton } from "@/components/layout/WhatsappFloatButton";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const meta = messages?.metadata as
    | { homeTitle?: string; homeDescription?: string }
    | undefined;

  return {
    title: meta?.homeTitle ?? "Jungle Wildlife Tours",
      description:
      meta?.homeDescription ??
      "Nature and wildlife tours in Manuel Antonio, Costa Rica.",
    alternates: {
      languages: {
        es: "/es",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased">
      <body
        className={`min-h-full flex flex-col bg-bg text-text ${cormorantGaramond.variable} ${dmSans.variable} ${spaceMono.variable} ${syne.variable}`}
      >
        <div className="grain-overlay" aria-hidden="true" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          {children}
          <Footer />
          <WhatsappFloatButton locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}