"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ShieldCheck,
    CheckCircle2,
    Info,
    AlertTriangle,
    Lightbulb,
    Calendar,
    ArrowRight,
    Loader2,
    ExternalLink
} from "lucide-react";
import { formatScheduleAge, formatVaccineAge } from "@/lib/vaccine-age";

type ProtectionItem = {
    icon: string;
    name: string;
    description: string;
};

type VaccineDetails = {
    name: string;
    protection?: string | null;
    importance?: string | null;
    description?: string | null;
    longDescription?: string | null;
    didYouKnow?: string | null;
    recommendedAge?: number;
    recommendedAgeDays?: number | null;
    doseNumber?: number;
    benefits?: string[];
    sideEffectsCommon?: string[];
    sideEffectsRare?: string[];
    fullProtectionList?: ProtectionItem[] | null;
    eligibilityRules?: {
        totalDoses?: number;
        scheduleAges?: string[];
        schedule?: "ROUTINE" | "TARGETED" | "ADOLESCENT";
        targetNote?: string;
        sourceLabel?: string;
        sourceUrl?: string;
    } | null;
};

interface VaccineDetailModalProps {
    vaccine: VaccineDetails | null | undefined;
    isOpen: boolean;
    onClose: () => void;
    actionLabel?: string;
    onAction?: () => void;
    actionDisabled?: boolean;
    actionLoading?: boolean;
}

export default function VaccineDetailModal({ vaccine, isOpen, onClose, actionLabel, onAction, actionDisabled, actionLoading }: VaccineDetailModalProps) {
    if (!vaccine) return null;

    const scheduleRules = (vaccine.eligibilityRules || {}) as {
        totalDoses?: number;
        scheduleAges?: string[];
        schedule?: "ROUTINE" | "TARGETED" | "ADOLESCENT";
        targetNote?: string;
        sourceLabel?: string;
        sourceUrl?: string;
    };
    const ageLabel = formatVaccineAge(vaccine);
    const doseLabel = vaccine.doseNumber === 0
        ? "Dose naissance"
        : scheduleRules.totalDoses
            ? `Dose ${vaccine.doseNumber} sur ${scheduleRules.totalDoses}`
            : `Dose ${vaccine.doseNumber || 1}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:h-[90vh] bg-slate-50 rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="relative h-48 bg-gradient-to-br from-sky-500 to-indigo-600 p-8 md:p-12 text-white overflow-hidden shrink-0">
                            <div className="relative z-10 flex items-start justify-between">
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight">{vaccine.name}</h2>
                                        <p className="text-white/80 font-medium uppercase tracking-widest text-[10px] mt-1">
                                            {vaccine.importance} • {vaccine.protection}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-md"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scrollbar-hide">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
                                    <Calendar className="text-sky-500" size={20} />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Âge Recommandé</span>
                                    <span className="text-lg font-black text-slate-800">{ageLabel}</span>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
                                    <ShieldCheck className="text-emerald-500" size={20} />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Type</span>
                                    <span className="text-lg font-black text-slate-800">{vaccine.importance}</span>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 col-span-2 md:col-span-1">
                                    <Info className="text-indigo-500" size={20} />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Doses</span>
                                    <span className="text-lg font-black text-slate-800">{doseLabel}</span>
                                </div>
                            </div>

                            {scheduleRules.scheduleAges && scheduleRules.scheduleAges.length > 0 && (
                                <div className="rounded-3xl border border-sky-100 bg-sky-50/70 p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">
                                            Calendrier de la série
                                        </p>
                                        {scheduleRules.schedule !== "ROUTINE" && (
                                            <span className="rounded-full bg-amber-100 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-amber-800">
                                                Éligibilité à confirmer
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {scheduleRules.scheduleAges.map((age, index) => (
                                            <span
                                                key={`${age}-${index}`}
                                                className="rounded-full border border-white bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm"
                                            >
                                                {index + 1}. {formatScheduleAge(age)}
                                            </span>
                                        ))}
                                    </div>
                                    {scheduleRules.targetNote && (
                                        <p className="mt-3 text-xs font-medium leading-5 text-amber-800">
                                            {scheduleRules.targetNote}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Two Columns Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Protects Against */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Protège contre</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {vaccine.fullProtectionList && vaccine.fullProtectionList.length > 0 ? (
                                            vaccine.fullProtectionList.map((item, i) => (
                                                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                    <div className="text-2xl">{item.icon}</div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                <p className="text-sm text-slate-600 font-medium">{vaccine.protection}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Bénéfices clés</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {vaccine.benefits?.map((benefit: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 p-4">
                                                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                                                    <CheckCircle2 size={12} />
                                                </div>
                                                <span className="text-sm text-slate-600 font-medium">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Importance Section */}
                            <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white shadow-xl shadow-teal-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all" />
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Info className="text-white/80" size={24} />
                                        <h3 className="text-lg font-black uppercase tracking-widest text-[11px] opacity-90">Importance au Cameroun</h3>
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed font-medium">
                                        {vaccine.longDescription}
                                    </p>
                                    {vaccine.didYouKnow && (
                                        <div className="mt-6 pt-6 border-t border-white/20 flex gap-4 items-start">
                                            <div className="p-2 bg-white/20 rounded-xl">
                                                <Lightbulb size={20} className="text-amber-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Le saviez-vous ?</p>
                                                <p className="text-sm italic text-white/90">{vaccine.didYouKnow}</p>
                                            </div>
                                        </div>
                                    )}
                                    {scheduleRules.sourceUrl && (
                                        <a
                                            href={scheduleRules.sourceUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-white/25"
                                        >
                                            Source officielle
                                            <ExternalLink size={13} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Side Effects */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Effets secondaires possibles</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600">Fréquents</h4>
                                        <ul className="space-y-2">
                                            {vaccine.sideEffectsCommon?.map((effect: string, i: number) => (
                                                <li key={i} className="text-sm text-slate-600 font-medium flex gap-2">
                                                    <span className="text-amber-400">•</span> {effect}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rares</h4>
                                        <ul className="space-y-2">
                                            {vaccine.sideEffectsRare?.map((effect: string, i: number) => (
                                                <li key={i} className="text-sm text-slate-600 font-medium flex gap-2">
                                                    <span className="text-slate-300">•</span> {effect}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="pt-6 pb-2">
                                {onAction && (
                                    <button
                                        onClick={onAction}
                                        disabled={actionDisabled || actionLoading}
                                        className="mb-3 flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-200 transition-transform enabled:hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                        {actionLoading ? "Enregistrement…" : actionLabel || "Marquer fait"}
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-full py-5 gradient-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-400/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95"
                                >
                                    {onAction ? "Fermer" : "J'ai compris"}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
