"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Cloud,
  Database,
  HardDrive,
  RefreshCw,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import SyncQueuePanel from "@/components/offline/SyncQueuePanel";

type OfflineStats = {
  cachedPages: number;
  hasChildrenData: boolean;
  hasCalendarPdf: boolean;
  storageUsedMb: string;
};

const emptyStats: OfflineStats = {
  cachedPages: 0,
  hasChildrenData: false,
  hasCalendarPdf: false,
  storageUsedMb: "0",
};

export default function OfflinePage() {
  const [online, setOnline] = useState(true);
  const [stats, setStats] = useState<OfflineStats>(emptyStats);
  const [refreshing, setRefreshing] = useState(false);

  const inspectOfflineStorage = async () => {
    if (!("caches" in window)) return;
    const cacheNames = await caches.keys();
    const requests = (
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          const cache = await caches.open(cacheName);
          return cache.keys();
        }),
      )
    ).flat();

    const paths = requests.map((request) => new URL(request.url).pathname);
    const estimate = await navigator.storage?.estimate?.();

    setStats({
      cachedPages: new Set(
        paths.filter(
          (path) =>
            !path.startsWith("/_next/") &&
            !path.startsWith("/api/") &&
            !/\.[a-z0-9]+$/i.test(path),
        ),
      ).size,
      hasChildrenData: paths.includes("/api/children"),
      hasCalendarPdf: paths.includes(
        "/documents/calendrier-rattrapage-pev-2024.pdf",
      ),
      storageUsedMb: ((estimate?.usage || 0) / 1024 / 1024).toFixed(1),
    });
  };

  useEffect(() => {
    const updateConnection = () => setOnline(navigator.onLine);
    updateConnection();
    inspectOfflineStorage();
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  const refresh = async () => {
    if (!online) return;
    setRefreshing(true);
    try {
      await Promise.all([
        fetch("/api/children"),
        fetch("/api/vaccines"),
        fetch("/documents/calendrier-rattrapage-pev-2024.pdf"),
      ]);
      await inspectOfflineStorage();
    } finally {
      setRefreshing(false);
    }
  };

  const items = [
    {
      label: "Calendrier PEV",
      detail: stats.hasCalendarPdf ? "Prêt hors ligne" : "À télécharger",
      ready: stats.hasCalendarPdf,
      icon: CalendarDays,
    },
    {
      label: "Dernier suivi familial",
      detail: stats.hasChildrenData ? "Copie locale disponible" : "Ouvrez votre profil en ligne",
      ready: stats.hasChildrenData,
      icon: Database,
    },
    {
      label: "Pages déjà visitées",
      detail: `${stats.cachedPages} page(s) conservée(s)`,
      ready: stats.cachedPages > 0,
      icon: BookOpenCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <header className="relative overflow-hidden rounded-[2.5rem] bg-[#040c2a] p-7 text-white shadow-2xl shadow-slate-300 md:p-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.75rem] ${
                online ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-sky-300"
              }`}
            >
              {online ? <Wifi size={38} /> : <WifiOff size={38} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                Continuité de service
              </p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">
                {online ? "Vous êtes en ligne" : "Mode hors ligne actif"}
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-300">
                {online
                  ? "Actualisez la copie locale avant un déplacement ou lorsque la connexion est bonne."
                  : "Vous pouvez consulter le calendrier PEV et les informations déjà chargées sur cet appareil."}
              </p>
            </div>
          </div>
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={96}
            height={96}
            className="hidden h-24 w-24 rounded-[1.75rem] shadow-xl md:block"
          />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Contenu local
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900">
                Disponible sur cet appareil
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
              <HardDrive size={15} />
              {stats.storageUsedMb} Mo
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    item.ready
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <item.icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-800">{item.label}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {item.detail}
                  </p>
                </div>
                {item.ready && (
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={refresh}
            disabled={!online || refreshing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-sky-200 transition enabled:hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing
              ? "Mise à jour…"
              : online
                ? "Actualiser la copie hors ligne"
                : "Connexion requise pour actualiser"}
          </button>
        </section>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-sky-100 bg-sky-50 p-6 md:p-8">
            <ShieldCheck size={28} className="text-sky-600" />
            <h2 className="mt-4 text-xl font-black text-slate-900">
              Ce qui fonctionne hors ligne
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-slate-600">
              <li>• Consulter le calendrier de rattrapage structuré et le PDF source.</li>
              <li>• Relire les pages et données de suivi chargées auparavant.</li>
              <li>• Ouvrir l’application depuis l’écran d’accueil.</li>
            </ul>
          </section>

          <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
            <Cloud size={24} className="text-emerald-600" />
            <p className="mt-3 text-sm font-black text-emerald-950">
              Vos validations sont conservées hors ligne.
            </p>
            <p className="mt-2 text-xs font-medium leading-5 text-emerald-900/75">
              Les doses et profils modifiés sans réseau sont chiffrés sur cet appareil,
              puis synchronisés à la reconnexion avec revue des conflits.
            </p>
          </section>

          <Link
            href="/calendar"
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700"
          >
            <CalendarDays size={18} />
            Ouvrir le calendrier
          </Link>
        </div>
      </div>
      <SyncQueuePanel />
    </div>
  );
}
