import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientPage from "../ClientPage";
import { isSupportedLocale } from "@/locale-config";
import { getLocaleData } from "@/locale-data";
import { createLocaleMetadata, createStructuredData } from "@/seo";
import { englishFaq } from "@/seo-content";

function assertLocale(lang: string) {
  if (!isSupportedLocale(lang)) notFound();
  return lang;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = assertLocale(lang);
  const localeData = await getLocaleData(locale);
  return createLocaleMetadata(locale, localeData);
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = assertLocale(lang);
  const localeData = await getLocaleData(locale);
  const structuredData = createStructuredData(locale, localeData, locale === "en-US" ? englishFaq : []);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <ClientPage lang={locale} locale={localeData} />
    </>
  );
}
