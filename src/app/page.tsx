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
  TrendingUp,
  Sparkles,
  Zap,
  Calendar as CalendarIcon,
  Stethoscope
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
    <div className="relative space-y-12 pb-20 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-3xl -mr-64 -mt-32 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-200/20 rounded-full blur-3xl -ml-48 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-200/10 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Illustration Icons */}
      <div className="hidden lg:block absolute top-20 right-10 p-4 glass-card rounded-2xl animate-float shadow-xl border-white/80">
        <Sparkles className="text-amber-400" size={32} />
      </div>
      <div className="hidden lg:block absolute bottom-40 left-10 p-5 glass-card rounded-[2rem] animate-float-reverse shadow-xl border-white/80" style={{ animationDelay: '1s' }}>
        <Heart className="text-rose-400 fill-rose-400/10" size={40} />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-white shadow-sm mb-2">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Tableau de bord intelligent</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-violet-600">{session?.user?.name}</span> 👋
          </h1>
          <p className="text-slate-500 font-bold tracking-tight text-lg">
            {hasChildren
              ? `Aujourd'hui, vous protégez ${children.length} enfant(s).`
              : "Prêt à sécuriser l'avenir de vos enfants ?"
            }
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-5 glass-card rounded-[2rem] text-slate-600 relative hover:scale-110 transition-all border-white shadow-lg active:scale-95 group">
            <Bell size={24} className="group-hover:text-sky-500 transition-colors" />
            <span className="absolute top-5 right-5 w-3 h-3 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
          </button>
          {!hasChildren && (
            <Link href="/children/add" className="flex items-center gap-4 px-8 py-5 gradient-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-400/40 hover:scale-105 active:scale-95 transition-all">
              <Plus size={22} strokeWidth={3} />
              Ajouter un Enfant
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

      {/* Calendar Link Banner */}
      <div className="w-full relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-rose-400 via-pink-500 to-amber-500 p-8 md:p-10 shadow-2xl shadow-rose-500/20 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/30 transition-colors" />
          <div className="absolute bottom-0 left-10 w-32 h-32 bg-amber-300/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border-2 border-white/50 shadow-xl shrink-0">
                      <CalendarIcon size={32} />
                  </div>
                  <div>
                      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Le Calendrier <span className="text-amber-200">Magique</span></h2>
                      <p className="text-white/90 font-medium text-sm md:text-base mt-2 max-w-md">
                          Découvrez la frise chronologique joyeuse des vaccins de vos enfants. Suivez leur protection de façon ludique !
                      </p>
                  </div>
              </div>
              <Link href="/calendar" className="w-full md:w-auto px-8 py-5 bg-white text-rose-500 hover:text-rose-600 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shrink-0 border-2 border-transparent hover:border-rose-100">
                  Explorer
                  <ArrowRight size={18} />
              </Link>
          </div>
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
            <div className="relative group/discovery">
              {/* Decorative background for the section */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-sky-50/20 rounded-[3rem] -m-4 pointer-events-none border border-white/60 shadow-inner" />
              
              {children.length > 0 ? (
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {children.map((child: any) => (
                    <motion.div 
                      key={child.id} 
                      whileHover={{ y: -8 }}
                      className="p-8 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-sky-900/5 group border border-white hover:border-sky-200 transition-all flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Card accent blob */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-50 rounded-full blur-2xl group-hover:bg-sky-100/50 transition-colors" />
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-5">
                          <div className="w-20 h-20 bg-gradient-to-br from-sky-50 to-violet-50 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                            {child.image ? (
                              <img src={child.image} alt={child.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sky-400">
                                <Baby size={36} strokeWidth={1.5} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-slate-800 line-clamp-1 tracking-tight">{child.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                    Né le {new Date(child.birthDate).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                          </div>
                        </div>

                        {child.medicalInfo && (
                          <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                            <div className="flex items-center gap-2 mb-1">
                              <Stethoscope size={12} className="text-rose-500" />
                              <span className="text-[9px] font-black uppercase text-rose-600 tracking-wider">Note Médicale</span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium line-clamp-2 italic">
                              "{child.medicalInfo}"
                            </p>
                          </div>
                        )}

                        <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-[2rem] space-y-4 border border-white/50 shadow-inner">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                            <span className="text-slate-400 flex items-center gap-2">
                                <TrendingUp size={14} className="text-sky-500" />
                                Progression
                            </span>
                            <span className="text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                              {Math.round(((child.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (child.vaccinations?.length || 1)) * 100)}%
                            </span>
                          </div>
                          <div className="h-4 bg-white/50 rounded-full overflow-hidden p-1 border border-slate-100 shadow-sm">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.round(((child.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (child.vaccinations?.length || 1)) * 100)}%` }}
                              className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-violet-500 rounded-full shadow-lg shadow-sky-400/30"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedChildForCalendar(child);
                          setIsCalendarOpen(true);
                        }}
                        className="relative z-10 mt-8 w-full py-5 bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-violet-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 group-hover:shadow-sky-200 active:scale-95"
                      >
                        <CalendarIcon size={18} />
                        Gérer le Calendrier
                        <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="relative z-10 p-1 bg-gradient-to-br from-sky-200 via-violet-200 to-rose-200 rounded-[3.5rem] shadow-2xl shadow-sky-900/10 active:scale-[0.99] transition-transform">
                    <div className="bg-white/90 backdrop-blur-xl p-20 rounded-[3.4rem] text-center space-y-8">
                        <div className="relative w-40 h-40 mx-auto">
                            <div className="absolute inset-0 bg-sky-100 rounded-[3rem] animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center text-sky-500">
                                <Baby size={80} strokeWidth={1} />
                            </div>
                            {/* Small floating bubbles around the baby icon */}
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-4 -right-4 w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 rotate-12 shadow-lg">
                                <Heart size={20} fill="currentColor" />
                            </motion.div>
                            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} className="absolute -bottom-2 -left-6 w-14 h-14 bg-violet-100 rounded-3xl flex items-center justify-center text-violet-500 -rotate-12 shadow-lg">
                                <ShieldCheck size={24} />
                            </motion.div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Créez votre premier <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-violet-500">Carnet de Santé</span></h3>
                            <p className="text-slate-500 font-bold max-w-sm mx-auto text-lg opacity-80">
                                Le suivi vaccinal n'a jamais été aussi simple, coloré et rassurant.
                            </p>
                        </div>
                        <Link href="/add-child" className="group relative inline-flex items-center gap-4 px-12 py-6 gradient-primary text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-sky-400/40 transition-all hover:scale-105 active:scale-95">
                            <Plus size={24} strokeWidth={4} />
                            Ajouter un profil Enfant
                            <div className="absolute inset-0 rounded-[2.5rem] bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        </Link>
                    </div>
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
