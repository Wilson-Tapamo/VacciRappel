"use client";

import { motion } from "framer-motion";
import { Check, Clock, ChevronRight, User, Calendar } from "lucide-react";


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
        <div className="glass-card p-8 md:p-12 border-white/80 shadow-2xl shadow-sky-900/5 relative overflow-hidden bg-white/40 backdrop-blur-xl">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Parcours Vaccinal</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                        Historique des soins administrés
                    </p>
                </div>
                <button className="px-5 py-2.5 bg-sky-50 text-sky-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-sm border border-sky-100 flex items-center gap-2 group">
                    Voir Historique Complet 
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="space-y-10 relative before:absolute before:left-7 before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-sky-100 before:via-sky-200 before:to-transparent before:rounded-full">
                {vaccinations.length > 0 ? (
                    vaccinations.map((record: any, idx: number) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex items-start gap-6 relative group"
                        >
                            {/* Point icon */}
                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-xl shadow-emerald-200 group-hover:scale-110 transition-transform duration-500`}>
                                    <Check size={24} strokeWidth={3} />
                                </div>
                                <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg scale-110 group-hover:scale-150 transition-all opacity-0 group-hover:opacity-100" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white/60 p-6 rounded-[2rem] border border-white/80 shadow-sm hover:shadow-md hover:bg-white transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                                            {record.childImage ? (
                                                <img src={record.childImage} alt={record.childName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-sky-50 flex items-center justify-center text-sky-400">
                                                    <User size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg leading-none">{record.vaccine?.name}</h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 inline-block">
                                                Pour {record.childName}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="self-start lg:self-center px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                                        Terminé
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100/50">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50/50 rounded-xl text-sky-600 border border-sky-100/50">
                                        <Calendar size={14} />
                                        <span className="text-[11px] font-bold">
                                            {new Date(record.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-slate-500 border border-slate-100/50">
                                        <Clock size={14} />
                                        <span className="text-[11px] font-bold">{record.vaccine?.recommendedAge} mois</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-16 text-center space-y-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-white rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto shadow-inner border border-slate-50">
                            <Clock size={40} strokeWidth={1} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-800 font-black tracking-tight text-lg">En attente de données</p>
                            <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">Scannez le carnet de santé de votre enfant pour voir l'historique ici.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
