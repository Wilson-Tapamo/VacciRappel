"use client";

import { motion } from "framer-motion";
import { Check, Clock, ChevronRight } from "lucide-react";


export default function VaccinationTimeline({ childrenData }: { childrenData: any[] }) {
    // Collect all completed vaccinations from all children
    const completedVaccinations = childrenData.flatMap(child =>
        (child.vaccinations || [])
            .filter((v: any) => v.status === 'DONE')
            .map((v: any) => ({
                ...v,
                childName: child.name,
                childImage: child.image
            }))
    ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const vaccinations = completedVaccinations;

    return (
        <div className="glass-card p-6 md:p-10 border-white/60 shadow-xl shadow-sky-900/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Parcours Vaccinal</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Historique des vaccins administrés
                    </p>
                </div>
                <button className="text-sky-600 text-sm font-semibold hover:text-sky-700 transition-colors flex items-center gap-1">
                    Voir Historique <ChevronRight size={16} />
                </button>
            </div>

            <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {vaccinations.length > 0 ? (
                    vaccinations.map((record: any, idx: number) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 relative"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 bg-emerald-500 text-white shadow-lg shadow-emerald-200`}>
                                <Check size={20} />
                            </div>
                            <div className="flex-1 pb-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-800">{record.vaccine?.name}</h4>
                                        {childrenData.length > 1 && (
                                            <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase">
                                                {record.childName}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-100/50 text-emerald-700`}>
                                        Effectué
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-sm font-bold text-sky-600">
                                        {new Date(record.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                    <p className="text-sm text-slate-400">{record.vaccine?.recommendedAge} mois</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-10 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
                            <Clock size={32} />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Aucun vaccin enregistré pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
