"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  CloudUpload,
  LogOut,
  UserRound,
  WifiOff,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getQueueItems } from "@/lib/offlineQueue";
import { signOut, useSession } from "next-auth/react";

export default function MobileHeader() {
  const { data: session } = useSession();
  const [openPanel, setOpenPanel] = useState<"notifications" | "account" | null>(null);
  const [pendingSync, setPendingSync] = useState(0);
  const [online, setOnline] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refreshQueue = () => {
      getQueueItems()
        .then((items) => setPendingSync(items.length))
        .catch(() => setPendingSync(0));
    };
    refreshQueue();
    const refreshOnline = () => setOnline(navigator.onLine);
    refreshOnline();
    window.addEventListener("vacci:queue-changed", refreshQueue);
    window.addEventListener("online", refreshOnline);
    window.addEventListener("offline", refreshOnline);
    return () => {
      window.removeEventListener("vacci:queue-changed", refreshQueue);
      window.removeEventListener("online", refreshOnline);
      window.removeEventListener("offline", refreshOnline);
    };
  }, []);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setOpenPanel(null);
    };
    if (openPanel) document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [openPanel]);

  return (
    <header className="fixed inset-x-3 top-[max(.75rem,env(safe-area-inset-top))] z-[65] lg:hidden">
      <div
        ref={panelRef}
        className="relative flex h-16 items-center justify-between rounded-[1.4rem] border border-white/70 bg-white/62 px-3 shadow-xl shadow-sky-900/10 backdrop-blur-2xl"
      >
        <Link
          href="/"
          aria-label="Accueil VacciRappel"
          className="flex items-center gap-2.5"
        >
          <Image
            src="/brand/logo-mark.png"
            alt=""
            width={42}
            height={42}
            priority
            className="h-10 w-10 object-contain"
          />
          <span className="text-[15px] font-black tracking-tight text-slate-900">
            Vacci<span className="text-violet-600">Rappel</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setOpenPanel((value) =>
                value === "notifications" ? null : "notifications",
              )
            }
            aria-expanded={openPanel === "notifications"}
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-slate-700 shadow-sm transition active:scale-95"
          >
            {openPanel === "notifications" ? <X size={20} /> : <Bell size={20} />}
            {pendingSync > 0 && openPanel !== "notifications" && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
            )}
          </button>
          <button
            onClick={() =>
              setOpenPanel((value) => (value === "account" ? null : "account"))
            }
            aria-expanded={openPanel === "account"}
            aria-label="Menu utilisateur"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-300 transition active:scale-95"
          >
            {openPanel === "account" ? <X size={20} /> : <UserRound size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {openPanel === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="absolute right-0 top-[4.5rem] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.75rem] border border-white bg-white p-3 shadow-2xl shadow-slate-900/20"
            >
              <div className="flex items-center justify-between px-2 pb-3 pt-1">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-600">
                    Centre de suivi
                  </p>
                  <h2 className="text-lg font-black text-slate-900">
                    Notifications
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase text-slate-500">
                  {pendingSync ? `${pendingSync} attente(s)` : "À jour"}
                </span>
              </div>

              <Link
                href="/alerts"
                onClick={() => setOpenPanel(null)}
                className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-sky-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <CalendarClock size={18} />
                </span>
                <span>
                  <strong className="block text-sm text-slate-800">
                    Rappels vaccinaux
                  </strong>
                  <span className="text-xs font-medium leading-5 text-slate-500">
                    Consultez les doses proches et en retard.
                  </span>
                </span>
              </Link>

              <div
                className="mt-1 flex items-start gap-3 rounded-2xl p-3 transition hover:bg-emerald-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  {pendingSync ? (
                    <CloudUpload size={18} />
                  ) : online ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <WifiOff size={18} />
                  )}
                </span>
                <span>
                  <strong className="block text-sm text-slate-800">
                    {pendingSync
                      ? `${pendingSync} modification(s) à synchroniser`
                      : "Données synchronisées"}
                  </strong>
                  <span className="text-xs font-medium leading-5 text-slate-500">
                    {online
                      ? "La copie locale est disponible."
                      : "Vos actions seront envoyées à la reconnexion."}
                  </span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {openPanel === "account" && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="absolute right-0 top-[4.5rem] w-64 overflow-hidden rounded-[1.75rem] border border-white bg-white p-3 shadow-2xl shadow-slate-900/20"
            >
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <UserRound size={19} />
                </span>
                <p className="mt-3 truncate text-sm font-black">
                  {session?.user?.name || "Mon compte"}
                </p>
                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  Espace personnel
                </p>
              </div>

              <Link
                href="/account"
                onClick={() => setOpenPanel(null)}
                className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <UserRound size={17} />
                </span>
                Profil
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <LogOut size={17} />
                </span>
                Déconnexion
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
