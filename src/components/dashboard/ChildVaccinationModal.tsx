"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    ChevronRight,
    Loader2,
    ShieldCheck
} from "lucide-react";

interface ChildVaccinationModalProps {
    child: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export default function ChildVaccinationModal({ child, isOpen, onClose, onUpdate }: ChildVaccinationModalProps) {
    const [updating, setUpdating] = useState<string | null>(null);

    const toggleStatus = async (recordId: string, currentStatus: string) => {
        setUpdating(recordId);
        const newStatus = currentStatus === "DONE" ? "PENDING" : "DONE";

        try {
            const res = await fetch(`/api/vaccinations/${recordId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(null);
        }
    };

    if (!child) return null;

    // Sort vaccinations by date
    const vaccinations = [...(child.vaccinations || [])].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl md:max-h-[85vh] bg-white rounded-[3rem] shadow-2xl z-[111] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-sky-100 border-4 border-white shadow-sm">
                                    {child.image ? (
                                        <img src={child.image} alt={child.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sky-500">
                                            <ShieldCheck size={24} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight">{child.name}</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Calendrier de vaccination</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm active:scale-95"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
                            {vaccinations.length === 0 ? (
                                <div className="text-center py-10 space-y-4">
                                    <p className="text-slate-400 font-medium italic">Aucun vaccin programmé.</p>
                                </div>
                            ) : (
                                vaccinations.map((v: any, i: number) => {
                                    const isDone = v.status === "DONE";
                                    const date = new Date(v.date);
                                    const isUpdating = updating === v.id;

                                    return (
                                        <motion.div
                                            key={v.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between gap-4 ${isDone
                                                    ? "bg-emerald-50/30 border-emerald-100 shadow-sm"
                                                    : "bg-white border-slate-50 shadow-sm"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400"
                                                    }`}>
                                                    {isDone ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className={`font-black tracking-tight ${isDone ? "text-emerald-900" : "text-slate-800"}`}>
                                                        {v.vaccine?.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <CalendarIcon size={12} className="text-slate-400" />
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                            {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleStatus(v.id, v.status)}
                                                disabled={isUpdating}
                                                className={`px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 ${isDone
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                                        : "bg-slate-100 text-slate-500 hover:bg-sky-500 hover:text-white hover:shadow-lg hover:shadow-sky-200"
                                                    }`}
                                            >
                                                {isUpdating ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : isDone ? (
                                                    "Effectué"
                                                ) : (
                                                    "Marquer fait"
                                                )}
                                            </button>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-slate-50/50 border-t border-slate-50">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-sky-500 hover:text-sky-600 transition-all active:scale-95"
                            >
                                Fermer
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
