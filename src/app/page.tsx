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
  Baby,
  Search,
  ArrowRight,
  Calendar as CalendarIcon
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import VaccinationTimeline from "@/components/dashboard/VaccinationTimeline";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import Link from "next/link";
import { motion } from "framer-motion";
import ChildVaccinationModal from "@/components/dashboard/ChildVaccinationModal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChildForCalendar, setSelectedChildForCalendar] = useState<any>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/children")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setChildren(data);
          } else {
            console.error("API Error:", data);
            setChildren([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Fetch Error:", err);
          setChildren([]);
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


  const refreshData = () => {
    fetch("/api/children")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setChildren(data);
        }
      });
  };

  const hasChildren = children.length > 0;

  // Calculate real stats
  const totalVaccinations = children.reduce((acc, child) => acc + (child.vaccinations?.length || 0), 0);
  const doneVaccinations = children.reduce((acc, child) =>
    acc + (child.vaccinations?.filter((v: any) => v.status === 'DONE')?.length || 0), 0);

  // Calculate real stats
  const allVaccinations = children.flatMap(child => child.vaccinations || []);
  const totalVaccinations = allVaccinations.length;
  const doneVaccinations = allVaccinations.filter((v: any) => v.status === 'DONE').length;

  const vaccinationRate = totalVaccinations > 0
    ? Math.round((doneVaccinations / totalVaccinations) * 100)
    : 0;

  // Find the single next vaccine (closest in the future and pending)
  const pendingVaccinations = allVaccinations
    .filter((v: any) => v.status !== 'DONE')
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextVaccination = pendingVaccinations[0];
  let nextVaccineInfo = { name: "Aucun", days: 0 };

  if (nextVaccination) {
    const nextDate = new Date(nextVaccination.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = nextDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    nextVaccineInfo = {
      name: nextVaccination.vaccine?.name || "Vaccin",
      days: diffDays
    };
  }

  const upcomingRemindersCount = children.reduce((acc, child) => {
    const upcoming = child.vaccinations?.filter((v: any) => {
      const date = new Date(v.date);
      date.setHours(0, 0, 0, 0);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      thirtyDaysFromNow.setHours(23, 59, 59, 999);
      return v.status !== 'DONE' && date >= now && date <= thirtyDaysFromNow;
    })?.length || 0;
    return acc + upcoming;
  }, 0);

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
            <Link href="/children/add" className="flex items-center gap-3 px-6 py-4 gradient-primary text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-sky-400/30 hover:scale-105 transition-all">
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
          value={hasChildren ? `${vaccinationRate}%` : "0%"}
          progress={hasChildren ? vaccinationRate : undefined}
          icon={ShieldCheck}
          color="sky"
        />
        <StatCard
          title="Prochain Rappel"
          value={hasChildren && nextVaccineInfo.name !== "Aucun"
            ? nextVaccineInfo.name
            : "Aucun"
          }
          description={hasChildren && nextVaccineInfo.name !== "Aucun"
            ? `Dans ${nextVaccineInfo.days} jour(s)`
            : "Pas de rappel prévu"
          }
          icon={Calendar}
          color="indigo"
          isUrgent={nextVaccineInfo.days <= 7 && nextVaccineInfo.name !== "Aucun"}
        />
        <StatCard
          title="Alertes actives"
          value={hasChildren ? upcomingRemindersCount.toString() : "0"}
          description="Sous 30 jours"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Points Santé"
          value="120"
          icon={Heart}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Timeline Card */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest text-[11px]">Parcours Vaccinal</h2>
              <Link href="/scan" className="text-sky-600 font-black uppercase tracking-widest text-[10px] hover:text-sky-700">Voir tout</Link>
            </div>
            <VaccinationTimeline childrenData={children} />
          </div>

          {/* New Vaccine Discovery Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest text-[11px] px-2 text-center pb-4">Consulter les Vaccins</h2>
            <div className="glass-card p-10 border-white/60 shadow-xl shadow-sky-900/5 space-y-8 bg-white/40">
              {children.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {children.map((child: any) => (
                    <div key={child.id} className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-sky-900/5 group border-2 border-transparent hover:border-sky-100 transition-all flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center gap-5">
                          <div className="w-20 h-20 bg-sky-50 rounded-3xl overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform">
                            {child.image ? (
                              <img src={child.image} alt={child.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sky-500">
                                <Baby size={32} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-800 line-clamp-1">{child.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              {new Date(child.birthDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50/50 p-5 rounded-3xl space-y-4">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Progression</span>
                            <span className="text-sky-600">
                              {Math.round(((child.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (child.vaccinations?.length || 1)) * 100)}%
                            </span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.round(((child.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (child.vaccinations?.length || 1)) * 100)}%` }}
                              className="h-full gradient-primary rounded-full shadow-lg shadow-sky-400/20"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedChildForCalendar(child);
                          setIsCalendarOpen(true);
                        }}
                        className="mt-8 w-full py-4 bg-slate-50 hover:bg-sky-500 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
                      >
                        <CalendarIcon size={16} />
                        Gérer Calendrier
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/40 border-2 border-white/60 p-20 rounded-[3rem] text-center space-y-8 backdrop-blur-sm">
                  <div className="w-32 h-32 bg-sky-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-sky-500 animate-pulse">
                    <Baby size={60} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">C'est un peu vide ici !</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">
                      Ajoutez votre premier enfant pour commencer à suivre son calendrier de vaccination personnalisé.
                    </p>
                  </div>
                  <Link href="/add-child" className="inline-flex items-center gap-3 px-10 py-5 gradient-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-200 transition-all hover:scale-105 active:scale-95">
                    <Plus size={20} />
                    Ajouter un Enfant
                  </Link>
                </div>
              )}
            </div>
          </div>
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

      <ChildVaccinationModal
        child={selectedChildForCalendar}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onUpdate={() => {
          refreshData();
        }}
      />
    </div>
  );
}
