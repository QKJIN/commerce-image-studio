import type { MetadataRoute } from "next";
import {
  getLocalePath,
  siteUrl,
  supportedLocales,
} from "@/locale-config";
import { guides } from "@/guides";
import { getGuidePath } from "@/seo";

export const dynamic = "force-static";

const languages = siteUrl ? Object.fromEntries(
  [
    ...supportedLocales.map((locale) => [
      locale,
      `${siteUrl}${getLocalePath(locale)}`,
    ]),
    ["x-default", `${siteUrl}/zh-CN/`],
  ],
) : {};

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    ...supportedLocales.map((locale) => ({
      url: `${siteUrl}${getLocalePath(locale)}`,
      changeFrequency: "monthly" as const,
      priority: 1,
      alternates: { languages },
    })),
    ...guides.map((guide) => ({
      url: `${siteUrl}${getGuidePath(guide)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
