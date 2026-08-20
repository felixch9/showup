"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/types";
import { t, type Dict } from "@/lib/i18n";
import { getJobs, getLang, setLang as persist, upsertJob } from "@/lib/store";
import { cloudLoadJobs, cloudLoadOffers } from "@/lib/cloud";
import { setOffers } from "@/lib/store";

const Ctx = createContext<{
  lang: Lang;
  d: Dict;
  setLang: (l: Lang) => void;
}>({ lang: "en", d: t("en"), setLang: () => {} });

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(getLang());
    void (async () => {
      const remote = await cloudLoadJobs();
      const local = getJobs();
      const seen = new Set(local.map((j) => j.id));
      remote.forEach((j) => {
        if (!seen.has(j.id)) upsertJob(j);
      });
      const offers = await cloudLoadOffers();
      if (offers.length) setOffers(offers);
    })();
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
