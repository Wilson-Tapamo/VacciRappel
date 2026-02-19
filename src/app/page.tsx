"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  ChevronRight,
  Plus,
  ShieldCheck,
  Activity,
  Heart,
  Baby
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import VaccinationTimeline from "@/components/dashboard/VaccinationTimeline";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/children")
        .then(res => res.json())
        .then(data => {
          setChildren(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full"
        />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
        <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center text-sky-500 shadow-inner">
          <Baby size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenue sur VacciCare</h1>
        <p className="text-slate-500 max-w-sm">Connectez-vous pour suivre le calendrier vaccinal de vos enfants et recevoir des alertes personnalisées.</p>
        <div className="flex gap-4">
          <Link href="/auth/login" className="px-8 py-3 gradient-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-sky-200">
            Se Connecter
          </Link>
          <Link href="/auth/register" className="px-8 py-3 glass text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm">
            S'inscrire
          </Link>
        </div>
      </div>
    );
  }

  const hasChildren = children.length > 0;

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Bonjour, <span className="text-sky-600">{session?.user?.name}</span> 👋
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">
            {hasChildren
              ? `Vous gérez les profils de ${children.length} enfant(s).`
              : "Commencez par ajouter le profil de votre enfant."
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-4 glass rounded-3xl text-slate-600 relative hover:scale-105 transition-all">
            <Bell size={22} />
            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
          </button>
          {!hasChildren && (
            <Link href="/profile" className="flex items-center gap-3 px-6 py-4 gradient-primary text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-sky-400/30 hover:scale-105 transition-all">
              <Plus size={18} />
              Ajouter Enfant
            </Link>
          )}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Taux de Vaccination"
          value={hasChildren ? "85%" : "0%"}
          change="+5%"
          icon={ShieldCheck}
          color="sky"
        />
        <StatCard
          title="Prochains Rappels"
          value={hasChildren ? "3" : "0"}
          icon={Calendar}
          change="Sous 30 jours"
          color="indigo"
        />
        <StatCard
          title="Suivi Croissance"
          value={hasChildren ? "Optimal" : "-"}
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Alertes Santé"
          value="0"
          icon={Heart}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Timeline Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest text-[11px]">Parcours Vaccinal</h2>
            <Link href="/scan" className="text-sky-600 font-black uppercase tracking-widest text-[10px] hover:text-sky-700">Voir tout</Link>
          </div>
          <VaccinationTimeline childrenData={children} />
        </div>

        {/* Alerts & Tips */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest text-[11px] px-2">Dernières Alertes</h2>
            <RecentAlerts />
          </div>

          {/* Conseil du jour Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-sky-600 via-indigo-600 to-indigo-700 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all" />

            <h3 className="text-lg font-black mb-4 relative z-10 uppercase tracking-widest text-[11px] opacity-80">Conseil du Jour</h3>
            <p className="text-sm font-medium leading-relaxed opacity-95 relative z-10 mb-8">
              "N'oubliez pas d'apporter le carnet de santé lors de chaque rendez-vous, même pour un simple contrôle."
            </p>

            <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all border border-white/30">
              En savoir plus
              <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
