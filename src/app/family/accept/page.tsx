"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Users } from "lucide-react";

export default function AcceptFamilyInvitePage() {
  const [state, setState] = useState({ loading: true, ok: false, message: "Vérification de l’invitation…" });

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      queueMicrotask(() => setState({ loading: false, ok: false, message: "Invitation incomplète." }));
      return;
    }
    fetch("/api/family/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (response) => {
      const data = await response.json();
      setState({
        loading: false,
        ok: response.ok,
        message: response.ok ? `Le carnet de ${data.childName} est maintenant partagé avec vous.` : data.message,
      });
    }).catch(() => setState({ loading: false, ok: false, message: "Impossible de vérifier l’invitation." }));
  }, []);

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center">
      <section className="w-full rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${state.ok ? "bg-emerald-100 text-emerald-600" : "bg-sky-100 text-sky-600"}`}>
          {state.ok ? <CheckCircle2 size={36} /> : <Users size={36} />}
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">Partage familial</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{state.message}</p>
        {!state.loading && <Link href="/profile" className="mt-7 inline-flex rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black text-white">Ouvrir les profils</Link>}
      </section>
    </div>
  );
}
