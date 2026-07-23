"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Download, Share, Smartphone, WifiOff, X } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "vacci-rappel-install-dismissed-at";
const DISMISS_FOR_MS = 7 * 24 * 60 * 60 * 1000;

function subscribeToNetwork(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function subscribeToStaticValue() {
  return () => undefined;
}

function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export default function PwaManager() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const isIos = useSyncExternalStore(
    subscribeToStaticValue,
    () => /iphone|ipad|ipod/i.test(navigator.userAgent),
    () => false,
  );
  const isOnline = useSyncExternalStore(
    subscribeToNetwork,
    () => navigator.onLine,
    () => true,
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    }

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (isRunningStandalone()) return;

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() - dismissedAt < DISMISS_FOR_MS) return;

    const timer = window.setTimeout(() => {
      if (installEvent || /iphone|ipad|ipod/i.test(navigator.userAgent)) {
        setShowInstall(true);
      }
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [installEvent]);

  useEffect(() => {
    const openInstaller = () => {
      if (!isRunningStandalone()) setShowInstall(true);
    };
    window.addEventListener("vacci:show-install", openInstaller);
    return () => window.removeEventListener("vacci:show-install", openInstaller);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShowInstall(false);
  }, []);

  const install = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") {
      setShowInstall(false);
      setInstallEvent(null);
    }
  }, [installEvent]);

  return (
    <>
      {!isOnline && (
        <div className="fixed top-3 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-xl">
          <span className="flex items-center gap-2">
            <WifiOff size={14} />
            Hors ligne · les données déjà consultées restent disponibles
          </span>
        </div>
      )}

      {showInstall && !isRunningStandalone() && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              onClick={dismiss}
              aria-label="Fermer"
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4 pr-8">
              <Image
                src="/icons/icon-192.png"
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl shadow-lg shadow-sky-200"
              />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-600">
                  Toujours à portée de main
                </p>
                <h2 id="install-title" className="mt-1 text-2xl font-black text-slate-900">
                  Installer VacciRappel
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm font-medium leading-6 text-slate-600">
              Ouvrez l’application depuis votre écran d’accueil et retrouvez le
              calendrier de rattrapage même avec une connexion instable.
            </p>

            {isIos && !installEvent ? (
              <div className="mt-5 rounded-2xl bg-sky-50 p-4 text-sm text-slate-700">
                <p className="flex items-center gap-2 font-bold text-sky-800">
                  <Share size={18} />
                  Sur iPhone ou iPad
                </p>
                <p className="mt-2 leading-6">
                  Dans Safari, touchez <strong>Partager</strong>, puis
                  <strong> Sur l’écran d’accueil</strong> et confirmez avec
                  <strong> Ajouter</strong>.
                </p>
              </div>
            ) : installEvent ? (
              <button
                onClick={install}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5"
              >
                <Download size={19} />
                Installer l’application
              </button>
            ) : (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-sm font-medium text-slate-600">
                <Smartphone size={20} className="shrink-0 text-violet-500" />
                Utilisez le menu de votre navigateur puis « Installer
                l’application » ou « Ajouter à l’écran d’accueil ».
              </div>
            )}

            <button
              onClick={dismiss}
              className="mt-3 w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}
    </>
  );
}
