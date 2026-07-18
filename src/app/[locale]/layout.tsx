import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsappFloatButton } from "@/components/layout/WhatsappFloatButton";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

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
    openGraph: {
      title: meta?.homeTitle ?? "Jungle Wildlife Tours",
      description: meta?.homeDescription ?? "Nature and wildlife tours in Manuel Antonio, Costa Rica.",
      locale: locale === "es" ? "es_CR" : "en_US",
    },
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
    <>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang="${locale}"` }} />
      <ScrollProgress />
      <NextIntlClientProvider locale={locale} messages={messages}>
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFloatButton locale={locale} />
      <ScrollToTop />
    </NextIntlClientProvider>
    </>
  );
}
