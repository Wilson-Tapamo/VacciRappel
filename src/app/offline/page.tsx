"use client";

import { motion } from "framer-motion";
import {
    WifiOff,
    RotateCw,
    CloudOff,
    HardDriveDownload,
    ShieldCheck,
    Smartphone,
    CheckCircle2,
    Database
} from "lucide-react";

export default function OfflinePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200 mx-auto flex items-center justify-center text-slate-400">
                    <WifiOff size={48} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Mode Hors Ligne</h1>
                <p className="text-slate-500 max-w-lg mx-auto">
                    Vos données sont enregistrées localement sur votre appareil et seront synchronisées dès qu'une connexion sera disponible.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-slate-800 flex items-center gap-3">
                            <Database size={20} className="text-sky-500" />
                            État de la base locale
                        </h2>
                        <RotateCw size={18} className="text-slate-300 animate-spin-slow" />
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fichiers Scannés</span>
                                <span className="text-xs font-bold text-slate-600">4 / 4</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                            <p className="text-[10px] text-emerald-600 font-bold mt-3 flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Prêt pour la synchronisation
                            </p>
                        </div>

                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Données Profil</span>
                                <span className="text-xs font-bold text-slate-600">En attente</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    className="h-full bg-sky-500 rounded-full"
                                />
                            </div>
                            <p className="text-[10px] text-sky-600 font-bold mt-3 flex items-center gap-1">
                                <Smartphone size={12} />
                                Enregistré sur l'appareil
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-xl font-bold">Pourquoi utiliser le mode hors ligne ?</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: CloudOff, text: "Accès à vos données sans internet." },
                                    { icon: ShieldCheck, text: "Sécurité maximale des données locales." },
                                    { icon: HardDriveDownload, text: "Sauvegarde automatique continue." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="p-2 bg-white/10 rounded-xl">
                                            <item.icon size={20} className="text-sky-400" />
                                        </div>
                                        <p className="text-sm text-white/70 font-medium">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-4 bg-sky-500 hover:bg-sky-600 rounded-2xl font-bold transition-all shadow-lg shadow-sky-900/40">
                                Lancer la Synchronisation Manuelle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 4s linear infinite;
        }
      `}</style>
        </div>
    );
}
