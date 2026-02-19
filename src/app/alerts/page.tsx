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
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        Centre d'Alertes
                        <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs">
                            4
                        </div>
                    </h1>
                    <p className="text-slate-500 mt-1">Gérez vos notifications intelligentes et rappels de santé.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm">
                        <Settings2 size={20} />
                    </button>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm">
                        <Volume2 size={20} />
                    </button>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Marquer tout comme lu
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-50 px-8">
                    {['Toutes', 'Médical', 'Administratif', 'Réseau'].map((tab, i) => (
                        <button key={tab} className={`py-6 px-4 text-sm font-bold transition-all relative ${i === 0 ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                            }`}>
                            {tab}
                            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 rounded-t-full" />}
                        </button>
                    ))}
                </div>

                <div className="divide-y divide-slate-50">
                    {alerts.map((alert, idx) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 hover:bg-slate-50/50 transition-colors flex items-start gap-6 group"
                        >
                            <div className={`p-4 rounded-[1.5rem] shrink-0 ${alert.priority === 'high' ? 'bg-rose-50 text-rose-500' :
                                    alert.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-sky-50 text-sky-500'
                                }`}>
                                {alert.priority === 'high' ? <ShieldAlert size={28} /> :
                                    alert.priority === 'medium' ? <Calendar size={28} /> : <Info size={28} />}
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 group-hover:text-slate-900">{alert.title}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{alert.time}</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{alert.message}</p>
                                <div className="pt-3 flex items-center gap-3">
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${alert.category === 'Medical' ? 'bg-indigo-50 text-indigo-600' :
                                            alert.category === 'Admin' ? 'bg-amber-50 text-amber-600' :
                                                alert.category === 'Growth' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        {alert.category}
                                    </span>
                                    <div className="flex-1" />
                                    <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                                        <Check size={20} />
                                    </button>
                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
