"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  LogOut,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { mutateWithOfflineQueue } from "@/lib/offlineQueue";

type UserProfile = {
  id: string;
  name: string | null;
  phone: string;
  createdAt: string;
};

export default function AccountPage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Profil indisponible.");
        return data as UserProfile;
      })
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name || "", phone: data.phone });
      })
      .catch((error: Error) => {
        setMessage({ type: "error", text: error.message });
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await mutateWithOfflineQueue({
        url: "/api/profile",
        method: "PATCH",
        body: form,
      });
      if (!result.ok && !result.queued) {
        throw new Error(result.error || "La modification a échoué.");
      }
      const data = result.data as UserProfile | null;
      const nextProfile = data || (profile ? { ...profile, ...form } : null);
      if (nextProfile) setProfile(nextProfile);
      setForm({ name: form.name.trim(), phone: form.phone.replace(/\s+/g, "") });
      await update({ name: form.name.trim(), phone: form.phone.replace(/\s+/g, "") });
      setMessage({
        type: "success",
        text: result.queued
          ? "Modification enregistrée hors ligne. Elle sera synchronisée automatiquement."
          : "Informations mises à jour.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "La modification a échoué.",
      });
    } finally {
      setSaving(false);
    }
  };

  const initials = (form.name || session?.user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <Loader2 className="animate-spin text-sky-500" size={38} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7 pb-20">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#07152f] p-7 text-white shadow-2xl shadow-slate-300 md:p-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <motion.div
            initial={{ scale: 0.85, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] border border-white/20 bg-gradient-to-br from-sky-400 to-violet-500 text-3xl font-black shadow-2xl shadow-sky-950/40"
          >
            {initials || <UserRound size={38} />}
          </motion.div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Mon espace personnel
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {form.name || "Votre profil"}
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-300">
              Gardez vos coordonnées à jour pour sécuriser votre compte et vos
              rappels familiaux.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[1fr_.7fr]">
        <section className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-sky-900/5 backdrop-blur-xl md:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <UserRound size={20} />
            </span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                Informations personnelles
              </p>
              <h2 className="text-xl font-black text-slate-900">
                Identité du compte
              </h2>
            </div>
          </div>

          {message && (
            <div
              className={`mt-5 flex items-center gap-2 rounded-2xl border p-4 text-xs font-bold ${
                message.type === "success"
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-rose-100 bg-rose-50 text-rose-700"
              }`}
            >
              {message.type === "success" && <CheckCircle2 size={17} />}
              {message.text}
            </div>
          )}

          <div className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Nom complet
              </span>
              <span className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 transition focus-within:border-sky-300 focus-within:bg-white">
                <UserRound size={19} className="text-sky-500" />
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="w-full bg-transparent py-4 text-sm font-bold text-slate-800 outline-none"
                  placeholder="Votre nom"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Téléphone
              </span>
              <span className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 transition focus-within:border-violet-300 focus-within:bg-white">
                <Phone size={19} className="text-violet-500" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  className="w-full bg-transparent py-4 text-sm font-bold text-slate-800 outline-none"
                  placeholder="+237 6…"
                />
              </span>
            </label>

            <button
              onClick={save}
              disabled={saving || !form.name.trim() || !form.phone.trim()}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-sky-200 transition enabled:hover:-translate-y-0.5 disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6">
            <ShieldCheck className="text-emerald-600" size={28} />
            <h2 className="mt-4 font-black text-slate-900">Compte sécurisé</h2>
            <p className="mt-2 text-xs font-medium leading-5 text-slate-600">
              Votre numéro reste votre identifiant de connexion.
            </p>
          </div>

          {profile?.createdAt && (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <CalendarDays className="text-violet-500" size={25} />
              <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                Membre depuis
              </p>
              <p className="mt-1 font-black text-slate-800">
                {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-white px-5 py-4 text-xs font-black uppercase tracking-widest text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </aside>
      </div>
    </div>
  );
}
