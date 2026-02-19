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
    ArrowRight
} from "lucide-react";

interface VaccineDetailModalProps {
    vaccine: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function VaccineDetailModal({ vaccine, isOpen, onClose }: VaccineDetailModalProps) {
    if (!vaccine) return null;

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
                                    <span className="text-lg font-black text-slate-800">{vaccine.recommendedAge === 0 ? "Naissance" : `${vaccine.recommendedAge} mois`}</span>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2">
                                    <ShieldCheck className="text-emerald-500" size={20} />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Type</span>
                                    <span className="text-lg font-black text-slate-800">{vaccine.importance}</span>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 col-span-2 md:col-span-1">
                                    <Info className="text-indigo-500" size={20} />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Doses</span>
                                    <span className="text-lg font-black text-slate-800">Séquence PEV</span>
                                </div>
                            </div>

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
                                        {(vaccine.fullProtectionList as any[])?.length > 0 ? (
                                            (vaccine.fullProtectionList as any[]).map((item, i) => (
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
                            <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 text-white shadow-xl shadow-rose-100 relative overflow-hidden group">
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
                                <button
                                    onClick={onClose}
                                    className="w-full py-5 gradient-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-400/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95"
                                >
                                    J'ai compris
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
