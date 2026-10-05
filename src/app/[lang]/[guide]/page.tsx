import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientPage from "../../ClientPage";
import { findGuide, guides } from "@/guides";
import { getLocaleData } from "@/locale-data";
import { createGuideMetadata, createGuideStructuredData } from "@/seo";
import { GuideContent } from "@/views/guide/GuideContent";

// Guides exist only in English; any other language or slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ lang: "en-US", guide: guide.slug }));
}

function resolveGuide(lang: string, slug: string) {
  const guide = lang === "en-US" ? findGuide(slug) : undefined;
  if (!guide) notFound();
  return guide;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[guide]">): Promise<Metadata> {
  const { lang, guide: slug } = await params;
  return createGuideMetadata(resolveGuide(lang, slug));
}

export default async function GuidePage({ params }: PageProps<"/[lang]/[guide]">) {
  const { lang, guide: slug } = await params;
  const guide = resolveGuide(lang, slug);
  const locale = await getLocaleData("en-US");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: createGuideStructuredData(guide) }} />
      <ClientPage
        lang="en-US"
        locale={locale}
        landing={{
          heading: guide.heading,
          summary: guide.summary,
          presetId: guide.presetId,
          breadcrumb: guide.navLabel,
          content: <GuideContent guide={guide} />,
        }}
      />
    </>
  );
}
