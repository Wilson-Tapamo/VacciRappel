"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, CloudUpload, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { getQueueItems, QueueItemView, resolveQueueConflict, syncQueuedMutations } from "@/lib/offlineQueue";

function labelFor(item: QueueItemView) {
  if (item.url.includes("/vaccinations/")) return "Statut d’une dose vaccinale";
  if (item.url.includes("/children/")) return "Modification du profil enfant";
  return "Modification locale";
}

export default function SyncQueuePanel() {
  const [items, setItems] = useState<QueueItemView[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [online, setOnline] = useState(true);

  const refresh = useCallback(() => {
    getQueueItems().then(setItems).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    refresh();
    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    window.addEventListener("vacci:queue-changed", refresh);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("vacci:queue-changed", refresh);
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, [refresh]);

  const sync = async () => {
    setSyncing(true);
    await syncQueuedMutations();
    refresh();
    setSyncing(false);
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Synchronisation sécurisée</p>
          <h2 className="mt-1 text-xl font-black text-slate-900">Modifications en attente</h2>
        </div>
        <button onClick={sync} disabled={!items.length || syncing || !online} className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-xs font-black text-white disabled:bg-slate-300">
          <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
          Synchroniser
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-xs font-medium leading-5 text-emerald-900">
        <span className="flex items-center gap-2 font-black"><ShieldCheck size={16} />Chiffrement local AES-GCM</span>
        Les données de la file sont chiffrées avec une clé non exportable propre à cet appareil.
      </div>

      {!items.length ? (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-medium text-slate-500">
          <Check size={20} className="text-emerald-500" />
          Toutes les modifications sont synchronisées.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <article key={item.id} className={`rounded-2xl border p-4 ${item.state === "conflict" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 font-black text-slate-800">
                    {item.state === "conflict" ? <AlertTriangle size={17} className="text-amber-600" /> : <CloudUpload size={17} className="text-sky-600" />}
                    {labelFor(item)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{new Date(item.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{item.state === "conflict" ? "À revoir" : "En attente"}</span>
              </div>
              {item.state === "conflict" && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button onClick={() => resolveQueueConflict(item.id, "server")} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-600"><Trash2 size={14} />Garder la version serveur</button>
                  <button onClick={() => resolveQueueConflict(item.id, "local")} className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-3 text-xs font-black text-white"><CloudUpload size={14} />Réappliquer ma modification</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
