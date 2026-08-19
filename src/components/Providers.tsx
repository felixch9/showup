"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/types";
import { t, type Dict } from "@/lib/i18n";
import { getLang, setLang as persist } from "@/lib/store";

const Ctx = createContext<{
  lang: Lang;
  d: Dict;
  setLang: (l: Lang) => void;
}>({ lang: "en", d: t("en"), setLang: () => {} });

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(getLang());
  }, []);

  const value = useMemo(
    () => ({
      lang,
      d: t(lang),
      setLang: (l: Lang) => {
        persist(l);
        setLangState(l);
      },
    }),
    [lang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
