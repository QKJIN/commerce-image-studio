import ClientApp, { type Landing } from "@/ClientApp";
import type { SupportedLocale } from "@/locale-config";
import type { LocaleData } from "@/type";

type ClientPageProps = {
  lang: SupportedLocale;
  locale: LocaleData;
  landing?: Landing;
};

export default function ClientPage({ lang, locale, landing }: ClientPageProps) {
  return <ClientApp lang={lang} locale={locale} landing={landing} />;
}