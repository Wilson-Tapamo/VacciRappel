"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Baby,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Syringe,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardVaccination = {
  id: string;
  status: string;
  date: string;
  version?: number;
  vaccine?: {
    name?: string;
    protection?: string;
    doseNumber?: number;
  };
  childId: string;
  childName: string;
  childImage?: string;
  daysUntil: number;
};

type ModalKind = "next" | "alerts" | "progress" | null;

type Props = {
  kind: ModalKind;
  onClose: () => void;
  nextVaccination?: DashboardVaccination;
  alerts: DashboardVaccination[];
  allVaccinations: DashboardVaccination[];
  updatingId?: string | null;
  onMarkDone: (vaccination: DashboardVaccination) => void;
};

function deadline(vaccination: DashboardVaccination) {
  if (vaccination.daysUntil < 0) {
    return {
      label: `En retard de ${Math.abs(vaccination.daysUntil)} j`,
      className: "bg-rose-100 text-rose-700",
    };
  }
  if (vaccination.daysUntil === 0) {
    return { label: "Aujourd’hui", className: "bg-orange-100 text-orange-700" };
  }
  if (vaccination.daysUntil <= 3) {
    return {
      label: `Très proche · ${vaccination.daysUntil} j`,
      className: "bg-amber-100 text-amber-800",
    };
  }
  if (vaccination.daysUntil <= 14) {
    return {
      label: `Proche · ${vaccination.daysUntil} j`,
      className: "bg-violet-100 text-violet-700",
    };
  }
  return {
    label: `Dans ${vaccination.daysUntil} j`,
    className: "bg-sky-100 text-sky-700",
  };
}

function VaccineRow({
  vaccination,
  onMarkDone,
  updating,
}: {
  vaccination: DashboardVaccination;
  onMarkDone: (vaccination: DashboardVaccination) => void;
  updating: boolean;
}) {
  const isDone = vaccination.status === "DONE";
  const timing = deadline(vaccination);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl border p-4 sm:p-5",
        isDone
          ? "border-emerald-100 bg-emerald-50/60"
          : "border-slate-100 bg-white shadow-sm",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            isDone
              ? "bg-emerald-500 text-white"
              : "bg-sky-50 text-sky-600",
          )}
        >
          {isDone ? <CheckCircle2 size={21} /> : <Syringe size={21} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-black text-slate-900">
                {vaccination.vaccine?.name || "Vaccin"}
                {vaccination.vaccine?.doseNumber
                  ? ` · dose ${vaccination.vaccine.doseNumber}`
                  : ""}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Baby size={13} className="text-violet-500" />
                {vaccination.childName}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider",
                isDone
                  ? "bg-emerald-100 text-emerald-700"
                  : timing.className,
              )}
            >
              {isDone ? "Effectué" : timing.label}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 py-1.5">
              <CalendarDays size={13} />
              {new Date(vaccination.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {vaccination.vaccine?.protection && (
              <span className="line-clamp-1">
                Contre {vaccination.vaccine.protection}
              </span>
            )}
          </div>
          {!isDone && (
            <button
              onClick={() => onMarkDone(vaccination)}
              disabled={updating}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-600 disabled:opacity-50"
            >
              {updating ? (
                <Clock3 size={14} className="animate-spin" />
              ) : (
                <CheckCircle2 size={14} />
              )}
              Marquer fait
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function DashboardInsightsModal({
  kind,
  onClose,
  nextVaccination,
  alerts,
  allVaccinations,
  updatingId,
  onMarkDone,
}: Props) {
  const done = allVaccinations.filter((item) => item.status === "DONE");
  const pending = allVaccinations.filter((item) => item.status !== "DONE");
  const total = allVaccinations.length || 1;
  const rate = Math.round((done.length / total) * 100);

  const title =
    kind === "next"
      ? "Prochain vaccin à faire"
      : kind === "alerts"
        ? "Alertes vaccinales"
        : "Avancement vaccinal";

  return (
    <AnimatePresence>
      {kind && (
        <>
          <motion.button
            aria-label="Fermer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] cursor-default bg-slate-950/55 backdrop-blur-sm"
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-modal-title"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-x-3 bottom-3 z-[121] flex max-h-[88dvh] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-slate-50 shadow-2xl sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(680px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2"
          >
            <header className="flex items-center justify-between border-b border-slate-100 bg-white/80 p-5 backdrop-blur-xl sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-200">
                  {kind === "alerts" ? (
                    <AlertTriangle size={21} />
                  ) : (
                    <ShieldCheck size={21} />
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-600">
                    Suivi familial
                  </p>
                  <h2
                    id="dashboard-modal-title"
                    className="text-xl font-black text-slate-900"
                  >
                    {title}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-2xl bg-slate-100 p-3 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={19} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-7">
              {kind === "progress" && (
                <div className="mb-6 overflow-hidden rounded-[1.75rem] bg-slate-950 p-5 text-white sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                        Protection complétée
                      </p>
                      <p className="mt-2 text-4xl font-black">{rate}%</p>
                    </div>
                    <div className="text-right text-xs font-bold text-slate-300">
                      <p>{done.length} effectués</p>
                      <p>{pending.length} à faire</p>
                    </div>
                  </div>
                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rate}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {kind === "next" &&
                  (nextVaccination ? (
                    <VaccineRow
                      vaccination={nextVaccination}
                      onMarkDone={onMarkDone}
                      updating={updatingId === nextVaccination.id}
                    />
                  ) : (
                    <p className="rounded-3xl bg-emerald-50 p-8 text-center font-bold text-emerald-800">
                      Tous les vaccins sont à jour.
                    </p>
                  ))}

                {kind === "alerts" &&
                  (alerts.length ? (
                    alerts.map((vaccination) => (
                      <VaccineRow
                        key={vaccination.id}
                        vaccination={vaccination}
                        onMarkDone={onMarkDone}
                        updating={updatingId === vaccination.id}
                      />
                    ))
                  ) : (
                    <p className="rounded-3xl bg-emerald-50 p-8 text-center font-bold text-emerald-800">
                      Aucune alerte active.
                    </p>
                  ))}

                {kind === "progress" && (
                  <>
                    {!!pending.length && (
                      <div className="pb-2">
                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          À faire · {pending.length}
                        </p>
                        <div className="space-y-3">
                          {pending.map((vaccination) => (
                            <VaccineRow
                              key={vaccination.id}
                              vaccination={vaccination}
                              onMarkDone={onMarkDone}
                              updating={updatingId === vaccination.id}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {!!done.length && (
                      <details className="group rounded-3xl border border-emerald-100 bg-white p-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between font-black text-emerald-800">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Déjà effectués · {done.length}
                          </span>
                          <span className="text-xs text-emerald-600 group-open:hidden">
                            Afficher
                          </span>
                        </summary>
                        <div className="mt-4 space-y-3">
                          {done.map((vaccination) => (
                            <VaccineRow
                              key={vaccination.id}
                              vaccination={vaccination}
                              onMarkDone={onMarkDone}
                              updating={false}
                            />
                          ))}
                        </div>
                      </details>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
