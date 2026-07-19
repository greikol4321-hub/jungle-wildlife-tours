import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { WhatsappFloatButton } from "@/components/layout/WhatsappFloatButton";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SITE_URL } from "@/lib/site-config";

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
  const baseUrl = SITE_URL;

  const url = locale === "es" ? `${baseUrl}/es` : `${baseUrl}/en`;

  return {
    title: { absolute: meta?.homeTitle ?? "Jungle Wildlife Tours · Manuel Antonio, Costa Rica" },
    description:
      meta?.homeDescription ??
      "Nature and wildlife tours in Manuel Antonio, Costa Rica.",
    openGraph: {
      title: meta?.homeTitle ?? "Jungle Wildlife Tours",
      description: meta?.homeDescription ?? "Nature and wildlife tours in Manuel Antonio, Costa Rica.",
      locale: locale === "es" ? "es_CR" : "en_US",
      url,
    },
    alternates: {
      canonical: url,
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
      <link rel="preconnect" href="https://pxujzdhvftpzupaszzna.supabase.co" />
      <link rel="dns-prefetch" href="https://pxujzdhvftpzupaszzna.supabase.co" />
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
