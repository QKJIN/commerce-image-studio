import type { Metadata } from "next";
import type { LocaleData } from "./type";
import type { Guide } from "./guides";
import {
  getLocalePath,
  siteUrl,
  supportedLocales,
  type SupportedLocale,
} from "./locale-config";

export const metadataBase = siteUrl ? new URL(siteUrl) : undefined;

export const languageAlternates = Object.fromEntries(
  supportedLocales.map((locale) => [locale, getLocalePath(locale)]),
);

export function createLocaleMetadata(
  locale: SupportedLocale,
  localeData: LocaleData,
): Metadata {
  return {
    metadataBase,
    title: localeData.siteTitle,
    description: localeData.siteDescription,
    alternates: siteUrl ? {
      canonical: getLocalePath(locale),
      languages: {
        ...languageAlternates,
        "x-default": "/zh-CN/",
      },
    } : undefined,
    robots: siteUrl ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      url: siteUrl ? getLocalePath(locale) : undefined,
      title: localeData.siteTitle,
      description: localeData.siteDescription,
      siteName: locale === "zh-CN" ? "商图工坊" : "Commerce Image Studio",
      locale: locale.replace("-", "_"),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Commerce Image Studio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: localeData.siteTitle,
      description: localeData.siteDescription,
      images: ["/og-image.png"],
    },
    icons: {
      icon: "/icon.svg",
    },
    other: {
      google: "notranslate",
    },
  };
}

export function createStructuredData(
  locale: SupportedLocale,
  localeData: LocaleData,
  faq: Array<{ question: string; answer: string }>,
) {
  const url = siteUrl ? `${siteUrl}${getLocalePath(locale)}` : undefined;
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "WebApplication",
      name: locale === "zh-CN" ? "商图工坊" : "Commerce Image Studio",
      url,
      description: localeData.siteDescription,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser with JavaScript and WebAssembly",
      inLanguage: locale,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ];
  if (faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      url,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }
  // Escape "<" so the JSON cannot close the surrounding script element.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

export function getGuidePath(guide: Guide) {
  return `${getLocalePath("en-US")}${guide.slug}/`;
}

export function createGuideMetadata(guide: Guide): Metadata {
  const path = getGuidePath(guide);
  return {
    metadataBase,
    title: guide.title,
    description: guide.description,
    alternates: siteUrl ? { canonical: path } : undefined,
    robots: siteUrl ? undefined : { index: false, follow: false },
    openGraph: {
      type: "article",
      url: siteUrl ? path : undefined,
      title: guide.title,
      description: guide.description,
      siteName: "Commerce Image Studio",
      locale: "en_US",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Commerce Image Studio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: ["/og-image.png"],
    },
    icons: { icon: "/icon.svg" },
    other: { google: "notranslate" },
  };
}

export function createGuideStructuredData(guide: Guide) {
  const home = siteUrl ? `${siteUrl}${getLocalePath("en-US")}` : undefined;
  const url = siteUrl ? `${siteUrl}${getGuidePath(guide)}` : undefined;
  const graph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: home },
        { "@type": "ListItem", position: 2, name: guide.navLabel, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      url,
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}
