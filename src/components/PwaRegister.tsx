"use client";

import { useEffect, useState } from "react";
import { bootNative } from "@/lib/native";

type InstallEvt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function PwaRegister() {
  const [install, setInstall] = useState<InstallEvt | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    void bootNative();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstall(e as InstallEvt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const safari = /safari/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
    if (ios && safari && !standalone) setIosHint(true);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!install && !iosHint) return null;

  return (
    <div className="bg-ink text-paper text-center text-xs py-2 px-3 flex items-center justify-center gap-3">
      {install ? (
        <>
          <span>Install SHOWUP on this phone</span>
          <button
            className="btn btn-acid !py-1 !px-3 !text-xs"
            type="button"
            onClick={async () => {
              await install.prompt();
              setInstall(null);
            }}
          >
            Install
          </button>
        </>
      ) : (
        <span>iPhone: Share → Add to Home Screen for the full-screen app</span>
      )}
      <button type="button" className="opacity-60" onClick={() => { setInstall(null); setIosHint(false); }}>
        ×
      </button>
    </div>
  );
}
