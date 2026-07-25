"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Baby, CalendarClock, CheckCircle2, ChevronDown, Download, FileText, ShieldCheck, WifiOff } from "lucide-react";
import { catchUpGroups, catchUpRules, getAgeInMonths, getCatchUpGroup } from "@/data/catchUpSchedule";
import { cn } from "@/lib/utils";

type ChildSummary = {
  name?: string;
  birthDate?: string;
  vaccinations?: Array<{ status?: string }>;
};

const contactStyles = [
  "bg-blue-600 text-white",
  "bg-orange-600 text-white",
  "bg-slate-600 text-white",
  "bg-amber-500 text-slate-950",
];

export default function CatchUpPlanner({ child }: { child?: ChildSummary }) {
  const [showAllRules, setShowAllRules] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const ageMonths = useMemo(() => getAgeInMonths(child?.birthDate), [child?.birthDate]);
  const automaticGroup = getCatchUpGroup(ageMonths);
  const selectedGroup = catchUpGroups.find((group) => group.id === selectedGroupId) || automaticGroup || catchUpGroups[0];
  const completedCount = child?.vaccinations?.filter((vaccination) => vaccination.status === "DONE").length || 0;
  const isEligibleForCatchUp = Boolean(
    child &&
    automaticGroup &&
    ageMonths !== null &&
    ageMonths >= 6 &&
    completedCount === 0,
  );

  if (!isEligibleForCatchUp) return null;

  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-slate-200/70 bg-white shadow-xl shadow-sky-900/5">
      <div className="relative overflow-hidden bg-[#040c2a] px-6 py-7 text-white md:px-8">
        <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Image src="/brand/logo-mark.png" alt="" width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">PEV · Mise à jour 2024</span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white/75"><WifiOff size={12} />Disponible hors ligne</span>
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">Calendrier de rattrapage</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-300">Un repère pratique pour préparer le rattrapage d’un enfant jamais vacciné, d’après le document PEV fourni.</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a href="/documents/calendrier-rattrapage-pev-2024.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-slate-900 transition hover:bg-sky-50"><FileText size={16} />Voir l’original</a>
            <a href="/documents/calendrier-rattrapage-pev-2024.pdf" download className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-black text-white transition hover:bg-white/15"><Download size={16} />Télécharger</a>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-8">
        {child && ageMonths !== null && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
            <Baby className="mt-0.5 shrink-0 text-emerald-600" size={20} />
            <div className="text-sm leading-6">
              <p className="font-black">{child.name} · {ageMonths} mois</p>
              <p className="font-medium opacity-80">Aucune dose reçue avant 6 mois. Le groupe {automaticGroup?.id} mois a été sélectionné automatiquement.</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="catch-up-group" className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tranche d’âge à consulter</label>
          <div className="relative max-w-md">
            <select id="catch-up-group" value={selectedGroup.id} onChange={(event) => setSelectedGroupId(event.target.value)} className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-bold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
              {catchUpGroups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {selectedGroup.contacts.map((contact, index) => (
            <article key={`${selectedGroup.id}-${contact.label}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
              <div className={cn("p-4", contactStyles[index])}>
                <div className="flex items-center gap-2"><CalendarClock size={18} /><h3 className="font-black">{contact.label}</h3></div>
                <p className="mt-1 text-xs font-semibold opacity-80">{contact.timing}</p>
              </div>
              <ul className="flex flex-wrap gap-2 p-4">
                {contact.vaccines.map((vaccine) => <li key={vaccine} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-black text-slate-700 shadow-sm">{vaccine}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="flex items-center gap-2 font-black text-amber-950"><ShieldCheck size={19} className="text-amber-600" />Règles importantes</p>
            <ul className="mt-3 space-y-2 text-sm font-medium leading-6 text-amber-950/80">
              {catchUpRules.slice(0, showAllRules ? catchUpRules.length : 3).map((rule) => <li key={rule} className="flex gap-2"><CheckCircle2 size={15} className="mt-1 shrink-0 text-amber-600" /><span>{rule}</span></li>)}
            </ul>
            <button onClick={() => setShowAllRules((value) => !value)} className="mt-3 text-xs font-black text-amber-800 underline decoration-amber-400 underline-offset-4">{showAllRules ? "Réduire les règles" : "Afficher toutes les règles"}</button>
          </div>
          <div className="max-w-sm rounded-2xl bg-slate-100 p-5 text-xs font-medium leading-5 text-slate-600"><strong className="text-slate-900">À valider au centre de santé.</strong> Ce repère ne remplace ni l’examen du carnet, ni les recommandations d’un professionnel, notamment pour le VAP et les situations particulières.</div>
        </div>
      </div>
    </section>
  );
}
