"use client";

import { useEffect, type ReactNode } from "react";
import { configure } from "mobx";
import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import Home from "./views/home";
import { Loading } from "./components/Loading";
import type { SupportedLocale } from "./locale-config";
import type { LocaleData } from "./type";
import { homeState } from "./states/home";
import { LocaleContext } from "./locale-context";
import { createCommercePreset, type CommercePresetId } from "./commerce-presets";

export type Landing = {
  heading: string;
  summary: string;
  presetId: CommercePresetId;
  breadcrumb: string;
  content: ReactNode;
};

type ClientAppProps = {
  lang: SupportedLocale;
  locale: LocaleData;
  landing?: Landing;
};

export default function ClientApp({ lang, locale, landing }: ClientAppProps) {
  const landingPreset = landing?.presetId;
  useEffect(() => {
    configure({
      enforceActions: "never",
      useProxies: "ifavailable",
    });

    document.documentElement.lang = lang;
    window.localStorage.setItem("commerce-image-studio-locale", lang);
    if (landingPreset) {
      // Landing pages open with their own preset instead of saved settings.
      const option = createCommercePreset(landingPreset);
      homeState.option = option;
      homeState.tempOption = structuredClone(option);
    } else {
      homeState.restorePersistedOption();
    }
  }, [lang, landingPreset]);

  return (
    <LocaleContext.Provider value={{ lang, locale }}>
      <Home landing={landing} />
      <GlobalLoading />
    </LocaleContext.Provider>
  );
}

const GlobalLoading = observer(() => gstate.loading ? <Loading /> : null);
