export const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");
export const defaultLocale = "zh-CN";

export const localeOptions = [
  { key: "zh-CN", label: "简体中文" },
  { key: "en-US", label: "English" },
] as const;

export type SupportedLocale = (typeof localeOptions)[number]["key"];

export const supportedLocales = localeOptions.map(({ key }) => key);

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.some((supported) => supported === locale);
}

export function getLocalePath(locale: SupportedLocale) {
  return `/${locale}/`;
}
