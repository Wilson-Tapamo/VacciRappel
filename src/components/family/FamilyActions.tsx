"use client";

import { useState } from "react";
import { Check, Copy, Download, Share2, X } from "lucide-react";

export default function FamilyActions({ childId, childName, isOwner }: { childId: string; childName: string; isOwner: boolean }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"CAREGIVER" | "VIEWER">("CAREGIVER");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  const createInvite = async () => {
    const response = await fetch("/api/family/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, role }),
    });
    const data = await response.json();
    if (response.ok) setLink(data.link);
    else setMessage(data.message || "Impossible de créer l’invitation.");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {isOwner && (
          <button type="button" onClick={() => setOpen(true)} className="flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-4 text-[10px] font-black uppercase tracking-wider text-violet-700">
            <Share2 size={16} />Partager
          </button>
        )}
        <a href={`/api/children/${childId}/export`} className={`flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-[10px] font-black uppercase tracking-wider text-emerald-700 ${!isOwner ? "col-span-2" : ""}`}>
          <Download size={16} />PDF + QR
        </a>
      </div>

      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:items-center">
          <section role="dialog" aria-modal="true" aria-labelledby="family-share-title" className="relative w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl">
            <button type="button" aria-label="Fermer le partage familial" onClick={() => setOpen(false)} className="absolute right-5 top-5 rounded-full bg-slate-100 p-2 text-slate-500"><X size={18} /></button>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">Partage familial</p>
            <h2 id="family-share-title" className="mt-2 pr-10 text-2xl font-black text-slate-900">Partager le carnet de {childName}</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">Le lien expire dans 7 jours et ne révèle aucune donnée médicale avant connexion.</p>
            {!link ? (
              <>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button type="button" aria-pressed={role === "CAREGIVER"} onClick={() => setRole("CAREGIVER")} className={`rounded-2xl border p-4 text-left text-xs font-black ${role === "CAREGIVER" ? "border-violet-400 bg-violet-50 text-violet-800" : "border-slate-200 text-slate-500"}`}>Aidant<br /><span className="font-medium">Peut mettre à jour</span></button>
                  <button type="button" aria-pressed={role === "VIEWER"} onClick={() => setRole("VIEWER")} className={`rounded-2xl border p-4 text-left text-xs font-black ${role === "VIEWER" ? "border-violet-400 bg-violet-50 text-violet-800" : "border-slate-200 text-slate-500"}`}>Lecture seule<br /><span className="font-medium">Peut consulter</span></button>
                </div>
                <button onClick={createInvite} className="mt-5 w-full rounded-2xl bg-violet-600 p-4 text-sm font-black text-white">Créer le lien sécurisé</button>
              </>
            ) : (
              <div className="mt-6">
                <div className="break-all rounded-2xl bg-slate-100 p-4 text-xs font-medium text-slate-700">{link}</div>
                <button onClick={copy} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 p-4 text-sm font-black text-white">
                  {copied ? <Check size={17} /> : <Copy size={17} />}{copied ? "Lien copié" : "Copier le lien"}
                </button>
              </div>
            )}
            {message && <p className="mt-4 text-xs font-bold text-rose-600">{message}</p>}
          </section>
        </div>
      )}
    </>
  );
}
