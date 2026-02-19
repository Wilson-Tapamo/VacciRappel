"use client";

import { Bell, Info, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";

const alerts = [
    { id: 1, type: 'reminder', message: 'Rappel : Scanner le carnet de santé reçu hier.', time: 'Il y a 2h', icon: Info, color: 'sky' },
    { id: 2, type: 'urgent', message: 'Rendez-vous pédiatre demain à 14h30.', time: 'Il y a 5h', icon: TriangleAlert, color: 'amber' },
];

export default function RecentAlerts() {
    return (
        <div className="glass-card p-8 border-white/60 shadow-xl shadow-sky-900/5">
            <div className="flex items-center gap-2 mb-6">
                <Bell className="text-sky-500" size={20} />
                <h2 className="font-bold text-slate-800">Alertes Récentes</h2>
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                        <div className={`p-2 rounded-xl shrink-0 ${alert.color === 'sky' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                            <alert.icon size={18} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-700 leading-snug">{alert.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{alert.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-6 py-2.5 bg-slate-50 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
                Toutes les alertes
            </button>
        </div>
    );
}
