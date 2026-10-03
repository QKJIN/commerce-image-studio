import type { Metadata } from "next";
import type { LocaleData } from "./type";
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
    },
    icons: {
      icon: "/icon.svg",
    },
    other: {
      google: "notranslate",
    },
  };
}
