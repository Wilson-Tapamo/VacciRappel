"use client";

import { motion } from "framer-motion";
import {
    Bell,
    ShieldAlert,
    Calendar,
    Info,
    Check,
    MoreVertical,
    Settings2,
    Volume2
} from "lucide-react";

const alerts = [
    { id: 1, title: 'Rappel de Vaccination', message: 'Lucas doit effectuer son rappel DTP dans 15 jours.', time: 'Il y a 2h', priority: 'high', category: 'Medical' },
    { id: 2, title: 'Mise à jour Dossier', message: 'Veuillez confirmer l\'adresse de votre pédiatre traitant.', time: 'Il y a 5h', priority: 'medium', category: 'Admin' },
    { id: 3, title: 'Check-up Mensuel', message: 'Lucas a 14 mois aujourd\'hui ! Pensez à noter son poids.', time: 'Hier', priority: 'low', category: 'Growth' },
    { id: 4, title: 'Alerte Sanitaire', message: 'Campagne de vaccination contre la Polio dans votre quartier.', time: 'Hier', priority: 'high', category: 'Global' },
];

export default function AlertsPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 relative">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-rose-100/30 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[20%] -left-[5%] w-[30%] h-[30%] bg-sky-100/30 rounded-full blur-[100px]" />
            </div>

            {/* Hero Header */}
            <div className="relative p-10 md:p-14 glass-card bg-gradient-to-br from-slate-900 to-slate-800 border-none shadow-2xl overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-sky-500/20 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl -ml-24 -mb-24" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                            <Bell className="text-sky-400" size={14} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Temps Réel</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none flex items-center gap-4">
                            Centre d'Alertes
                            <div className="px-4 py-1 bg-gradient-to-r from-rose-500 to-coral-500 text-white rounded-2xl text-xl font-black shadow-lg shadow-rose-900/20">
                                4
                            </div>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg max-w-xl">
                            Recevez des notifications intelligentes sur la santé de vos enfants et les rappels vaccinaux critiques.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-[1.5rem] transition-all border border-white/10 backdrop-blur-md shadow-xl">
                            <Settings2 size={24} />
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-900 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl">
                            Tout marquer comme lu
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                {['Toutes', 'Médical', 'Administratif', 'Réseau'].map((tab, i) => (
                    <button 
                        key={tab} 
                        className={cn(
                            "px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all shadow-sm",
                            i === 0 
                                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-200" 
                                : "bg-white text-slate-400 hover:text-slate-600 border border-white/80"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div className="space-y-6">
                {alerts.map((alert, idx) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="glass-card group hover:bg-white transition-all border-white/80 bg-white/40 backdrop-blur-xl shadow-xl shadow-sky-900/5 relative overflow-hidden"
                    >
                        {/* Status border indicator */}
                        <div className={cn(
                            "absolute top-0 bottom-0 left-0 w-1.5",
                            alert.priority === 'high' ? 'bg-gradient-to-b from-rose-400 to-rose-600' :
                            alert.priority === 'medium' ? 'bg-gradient-to-b from-amber-400 to-amber-600' : 
                            'bg-gradient-to-b from-sky-400 to-sky-600'
                        )} />

                        <div className="p-8 md:p-10 flex flex-col md:flex-row items-start gap-8">
                            <div className={cn(
                                "w-16 h-16 rounded-[1.8rem] flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500",
                                alert.priority === 'high' ? 'bg-rose-50 text-rose-500 shadow-rose-100' :
                                alert.priority === 'medium' ? 'bg-amber-50 text-amber-500 shadow-amber-100' : 
                                'bg-sky-50 text-sky-500 shadow-sky-100'
                            )}>
                                {alert.priority === 'high' ? <ShieldAlert size={32} strokeWidth={2.5} /> :
                                    alert.priority === 'medium' ? <Calendar size={32} strokeWidth={2.5} /> : 
                                    <Info size={32} strokeWidth={2.5} />}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">
                                            {alert.title}
                                        </h3>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                alert.priority === 'high' ? 'bg-rose-500' :
                                                alert.priority === 'medium' ? 'bg-amber-500' : 'bg-sky-500'
                                            )} />
                                            Reçu {alert.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                            alert.category === 'Medical' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                            alert.category === 'Admin' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            alert.category === 'Growth' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            'bg-rose-50 text-rose-600 border-rose-100'
                                        )}>
                                            {alert.category}
                                        </span>
                                    </div>
                                </div>
                                
                                <p className="text-slate-500 font-medium text-lg leading-relaxed md:max-w-3xl">
                                    {alert.message}
                                </p>

                                <div className="pt-4 flex items-center justify-between border-t border-slate-50 group-hover:border-slate-100 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-2 text-sky-500 font-black uppercase tracking-widest text-[10px] hover:text-sky-600 transition-colors group/btn">
                                            <Check size={16} className="group-hover/btn:scale-125 transition-transform" />
                                            Acquitter
                                        </button>
                                        <button className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">
                                            Plus tard
                                        </button>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
