"use client";

import { useEffect } from "react";
import { configure } from "mobx";
import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import Home from "./views/home";
import { Loading } from "./components/Loading";
import type { SupportedLocale } from "./locale-config";
import type { LocaleData } from "./type";
import { homeState } from "./states/home";
import { LocaleContext } from "./locale-context";

type ClientAppProps = {
  lang: SupportedLocale;
  locale: LocaleData;
};

export default function ClientApp({ lang, locale }: ClientAppProps) {
  useEffect(() => {
    configure({
      enforceActions: "never",
      useProxies: "ifavailable",
    });

    document.documentElement.lang = lang;
    window.localStorage.setItem("commerce-image-studio-locale", lang);
    homeState.restorePersistedOption();
  }, [lang]);

  return (
    <LocaleContext.Provider value={{ lang, locale }}>
      <Home />
      <GlobalLoading />
    </LocaleContext.Provider>
  );
}

const GlobalLoading = observer(() => gstate.loading ? <Loading /> : null);
