"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Star, Clock, Phone, Globe, ChevronRight,
    Shield, Calendar, Activity, CheckCircle,
    Building2, Heart, Stethoscope, Baby, ArrowLeft,
    Search, Navigation, Info, Map
} from "lucide-react";
import Link from "next/link";
import MapPage from "../map/page";

const hospitals: Hospital[] = [
    {
        id: 1,
        name: "Hôpital Gynéco-Obstétrique de Yaoundé",
        shortName: "CHGO",
        type: "Public",
        specialty: "Pédiatrie & Maternité",
        rating: 4.8,
        reviews: 124,
        openHours: "Ouvert 24h/24",
        address: "Quartier Ngousso, Yaoundé",
        phone: "+237 222 21 48 64",
        website: "www.hgoy.cm",
        distance: "2.4 km",
        latitude: 3.8996,
        longitude: 11.5484,
        lastStockUpdate: "Aujourd’hui à 08h30",
        vaccineAvailability: { BCG: "AVAILABLE", Polio: "AVAILABLE", Rougeole: "LOW", DTP: "AVAILABLE", "Hépatite B": "AVAILABLE", "Méningite A": "UNKNOWN" },
        vaccineServices: ["BCG", "Polio", "Rougeole", "DTP", "Hépatite B", "Méningite A"],
        vaccineSessionDays: {},
        certifications: ["OMS Certified", "ISO 9001"],
        bedCount: 350,
        doctorCount: 42,
        color: "sky",
        gradient: "from-sky-400 to-cyan-500",
        bgColor: "bg-sky-50",
        tagColor: "badge-sky",
        image: null,
        tags: ["Vaccination", "Urgence", "Pédiatrie"],
        description: "Centre hospitalier de référence spécialisé en gynécologie et obstétrique avec un service de pédiatrie complet.",
        waitTime: "~25 min",
        nextAvailable: "Aujourd'hui 14h00"
    },
    {
        id: 2,
        name: "Clinique de l'Espoir",
        shortName: "CE",
        type: "Privé",
        specialty: "Médecine Générale",
        rating: 4.5,
        reviews: 89,
        openHours: "Ferme à 20h00",
        address: "Bastos, Yaoundé",
        phone: "+237 222 21 30 25",
        website: "www.clinique-espoir.cm",
        distance: "4.1 km",
        latitude: 3.8952,
        longitude: 11.5153,
        lastStockUpdate: "Hier à 17h10",
        vaccineAvailability: { BCG: "AVAILABLE", Polio: "LOW", DTP: "AVAILABLE", "Hépatite A": "UNKNOWN", Varicelle: "AVAILABLE" },
        vaccineServices: ["BCG", "Polio", "DTP", "Hépatite A", "Varicelle"],
        vaccineSessionDays: {},
        certifications: ["Accréditation HAS"],
        bedCount: 85,
        doctorCount: 18,
        color: "purple",
        gradient: "from-violet-400 to-purple-500",
        bgColor: "bg-violet-50",
        tagColor: "badge-purple",
        image: null,
        tags: ["Vaccination", "Check-up"],
        description: "Clinique privée moderne avec des équipements de pointe pour la vaccination et le suivi préventif.",
        waitTime: "~15 min",
        nextAvailable: "Demain 09h00"
    },
    {
        id: 3,
        name: "Centre de Santé d'Ebolowa",
        shortName: "CSE",
        type: "Public",
        specialty: "Soins Primaires",
        rating: 4.2,
        reviews: 56,
        openHours: "Ouvert 24h/24",
        address: "Zone Industrielle, Yaoundé",
        phone: "+237 222 28 14 90",
        website: null,
        distance: "5.7 km",
        latitude: 3.8411,
        longitude: 11.5347,
        lastStockUpdate: "Aujourd’hui à 07h45",
        vaccineAvailability: { BCG: "AVAILABLE", Polio: "AVAILABLE", Rougeole: "AVAILABLE", Tétanos: "LOW" },
        vaccineServices: ["BCG", "Polio", "Rougeole", "Tétanos"],
        vaccineSessionDays: {},
        certifications: ["Certifié MS Cameroun"],
        bedCount: 120,
        doctorCount: 12,
        color: "teal",
        gradient: "from-teal-400 to-emerald-500",
        bgColor: "bg-teal-50",
        tagColor: "badge-teal",
        image: null,
        tags: ["Vaccination", "Maternité"],
        description: "Centre de santé communautaire offrant des services de vaccination gratuits pour tous les enfants.",
        waitTime: "~40 min",
        nextAvailable: "Maintenant disponible"
    },
    {
        id: 4,
        name: "Polyclinique de la Sainte-Famille",
        shortName: "PSF",
        type: "Privé",
        specialty: "Pédiatrie",
        rating: 4.9,
        reviews: 201,
        openHours: "Lun-Sam 07h-19h",
        address: "Biyem-Assi, Yaoundé",
        phone: "+237 222 30 15 70",
        website: "www.polyclinique-sf.cm",
        distance: "3.2 km",
        latitude: 3.8467,
        longitude: 11.4872,
        lastStockUpdate: "Aujourd’hui à 09h05",
        vaccineAvailability: { BCG: "AVAILABLE", Polio: "AVAILABLE", DTP: "AVAILABLE", ROR: "LOW", "Hépatite B": "AVAILABLE", HPV: "UNKNOWN", Rotavirus: "AVAILABLE" },
        vaccineServices: ["BCG", "Polio", "DTP", "ROR", "Hépatite B", "HPV", "Rotavirus"],
        vaccineSessionDays: {},
        certifications: ["OMS Certified", "Accréditation HAS", "ISO 9001"],
        bedCount: 160,
        doctorCount: 28,
        color: "coral",
        gradient: "from-rose-400 to-pink-500",
        bgColor: "bg-rose-50",
        tagColor: "badge-coral",
        image: null,
        tags: ["Vaccination", "Urgence", "Pédiatrie Spécialisée"],
        description: "Polyclinique haut de gamme dédiée à la pédiatrie avec le plus large programme vaccinal de la région.",
        waitTime: "~10 min",
        nextAvailable: "Aujourd'hui 11h30"
    }
];

interface Hospital {
    id: number;
    name: string;
    shortName: string;
    type: string;
    specialty: string;
    rating: number;
    reviews: number;
    openHours: string;
    address: string;
    phone: string;
    website: string | null;
    distance: string;
    latitude: number;
    longitude: number;
    lastStockUpdate: string;
    vaccineAvailability: Record<string, "AVAILABLE" | "LOW" | "UNKNOWN">;
    vaccineServices: string[];
    vaccineSessionDays: Record<string, string>;
    certifications: string[];
    bedCount: number;
    doctorCount: number;
    color: string;
    gradient: string;
    bgColor: string;
    tagColor: string;
    image: string | null;
    tags: string[];
    description: string;
    waitTime: string;
    nextAvailable: string;
}

const colorMap: Record<string, { border: string; ring: string; badge: string }> = {
    sky: { border: "border-sky-200", ring: "ring-sky-500", badge: "bg-sky-100 text-sky-700" },
    purple: { border: "border-violet-200", ring: "ring-violet-500", badge: "bg-violet-100 text-violet-700" },
    teal: { border: "border-teal-200", ring: "ring-teal-500", badge: "bg-teal-100 text-teal-700" },
    coral: { border: "border-rose-200", ring: "ring-rose-500", badge: "bg-rose-100 text-rose-700" },
};

const lyophilizedVaccines = new Set([
    "BCG",
    "Rougeole",
    "ROR",
    "Fièvre jaune",
    "Méningite A",
]);

export default function HospitalProfilePage() {
    const [selectedHospital, setSelectedHospital] = useState<Hospital>(hospitals[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [mobileView, setMobileView] = useState<"map" | "hospitals">("map");

    const filtered = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectHospital = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        setActiveTab("overview");
    };

    const hospitalContent = (
        <div className="h-dvh space-y-6 overflow-y-auto bg-slate-50 px-4 pb-32 pt-24 lg:h-auto lg:space-y-8 lg:overflow-visible lg:bg-transparent lg:px-0 lg:pb-10 lg:pt-0">
            <div className="flex items-center justify-between lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileView("map")}
                    className="flex items-center gap-2 rounded-full border border-white bg-white/90 px-4 py-2.5 text-xs font-black text-slate-700 shadow-lg backdrop-blur-xl"
                >
                    <Map size={15} className="text-sky-500" />
                    Retour à la carte
                </button>
                <span className="rounded-full bg-sky-100 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-sky-700">
                    {filtered.length} centres
                </span>
            </div>

            {/* Hero Header */}
            <div className="relative hidden rounded-[2.5rem] overflow-hidden p-8 md:p-12 gradient-hero border border-white/80 shadow-xl lg:block">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-sky-200/40 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-violet-200/40 rounded-full -mb-16 blur-3xl pointer-events-none" />

                {/* Decorative floating icons */}
                <div className="absolute top-8 right-16 w-16 h-16 bg-white/60 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-lg animate-float hidden md:flex">
                    <Stethoscope className="text-sky-500" size={28} />
                </div>
                <div className="absolute top-24 right-40 w-10 h-10 bg-violet-100/80 rounded-2xl flex items-center justify-center animate-float-reverse hidden md:flex" style={{ animationDelay: '1s' }}>
                    <Heart className="text-rose-400" size={18} />
                </div>
                <div className="absolute bottom-8 right-24 w-12 h-12 bg-teal-100/80 rounded-2xl flex items-center justify-center animate-float hidden md:flex" style={{ animationDelay: '2s' }}>
                    <Shield className="text-teal-500" size={20} />
                </div>

                <Link href="/map" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors font-bold text-xs uppercase tracking-widest mb-6">
                    <ArrowLeft size={16} /> Retour à la Carte
                </Link>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                        Profils des <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-violet-500">Hôpitaux</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-lg">
                        Consultez les centres de vaccination partenaires et leurs services disponibles.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="mt-8 flex flex-wrap gap-6">
                    {[
                        { label: "Centres partenaires", value: "24+", icon: Building2, color: "text-sky-600", bg: "bg-white/70" },
                        { label: "Vaccins disponibles", value: "18", icon: Shield, color: "text-violet-600", bg: "bg-white/70" },
                        { label: "Enfants vaccinés", value: "12,400+", icon: Baby, color: "text-teal-600", bg: "bg-white/70" },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm border border-white/80`}>
                            <stat.icon className={stat.color} size={20} />
                            <div>
                                <p className="text-xl font-black text-slate-800">{stat.value}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hospital List */}
                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un hôpital..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium shadow-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all"
                        />
                    </div>

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{filtered.length} centre(s) trouvé(s)</p>

                    <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 no-scrollbar lg:hidden">
                        {filtered.map((hospital) => {
                            const isSelected = selectedHospital.id === hospital.id;
                            return (
                                <button
                                    type="button"
                                    key={hospital.id}
                                    onClick={() => selectHospital(hospital)}
                                    aria-label={`Afficher ${hospital.name}`}
                                    aria-pressed={isSelected}
                                    className="w-24 shrink-0 snap-start text-center"
                                >
                                    <span
                                        className={`mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-[3px] bg-white p-1 shadow-lg transition ${
                                            isSelected ? "scale-105 border-sky-500" : "border-white"
                                        }`}
                                    >
                                        <span className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${hospital.gradient} text-sm font-black text-white`}>
                                            {hospital.shortName}
                                        </span>
                                    </span>
                                    <span className="mt-2 block truncate text-[11px] font-black text-slate-800">
                                        {hospital.shortName}
                                    </span>
                                    <span className="block text-[9px] font-bold text-slate-400">
                                        {hospital.distance}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="hidden space-y-4 lg:block">
                        {filtered.map(h => {
                            const hc = colorMap[h.color];
                            const isSelected = selectedHospital.id === h.id;
                            return (
                                <motion.button
                                    key={h.id}
                                    whileHover={{ y: -2 }}
                                    onClick={() => selectHospital(h)}
                                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${isSelected
                                        ? `bg-white ${hc.border} shadow-xl shadow-${h.color}-900/10 ring-2 ${hc.ring}/20`
                                        : 'bg-white/60 border-transparent hover:border-slate-100 hover:bg-white'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${h.gradient} rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shrink-0`}>
                                            {h.shortName}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{h.name}</h3>
                                            </div>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                                                <MapPin size={11} /> {h.distance} · {h.specialty}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${hc.badge}`}>{h.type}</span>
                                                <span className="flex items-center gap-1 text-amber-500 text-[11px] font-black">
                                                    <Star size={11} fill="currentColor" />{h.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className={`shrink-0 mt-1 transition-colors ${isSelected ? 'text-sky-500' : 'text-slate-300'}`} size={18} />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Hospital Detail */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedHospital.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Header Card */}
                        <div className={`relative rounded-[2rem] overflow-hidden p-5 sm:p-8 bg-gradient-to-br ${selectedHospital.gradient} text-white shadow-2xl`}>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl" />
                            
                            {/* Floating decorative element */}
                            <div className="absolute top-6 right-8 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float">
                                <Building2 size={24} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">
                                        {selectedHospital.shortName}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black leading-tight">{selectedHospital.name}</h2>
                                        <p className="text-white/80 text-sm font-medium mt-1">{selectedHospital.specialty}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="bg-white/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{selectedHospital.type}</span>
                                            {selectedHospital.certifications.map((c: string) => (
                                                <span key={c} className="bg-white/20 text-[10px] font-black px-3 py-1 rounded-full">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-black">{selectedHospital.rating}</p>
                                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Note</p>
                                        <div className="flex justify-center gap-0.5 mt-1">
                                            {[1,2,3,4,5].map((s: number) => (
                                                <Star key={s} size={10} fill={s <= Math.round(selectedHospital.rating) ? "white" : "transparent"} className="text-white" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-black">{selectedHospital.bedCount}</p>
                                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Lits</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-black">{selectedHospital.doctorCount}</p>
                                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Médecins</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
                            {[
                                { id: "overview", label: "Aperçu" },
                                { id: "vaccines", label: "Vaccins" },
                                { id: "contact", label: "Contact & RDV" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                        ? `bg-gradient-to-r ${selectedHospital.gradient} text-white shadow-lg`
                                        : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === "overview" && (
                                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                                    {/* Description */}
                                    <div className="glass-card p-6 border-white/70">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${selectedHospital.gradient} rounded-xl flex items-center justify-center text-white`}>
                                                <Info size={18} />
                                            </div>
                                            <h3 className="font-black text-slate-800">À propos</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{selectedHospital.description}</p>
                                    </div>

                                    {/* Key info grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { icon: Clock, label: "Horaires", value: selectedHospital.openHours, color: "text-amber-600", bg: "bg-amber-50" },
                                            { icon: Navigation, label: "Distance", value: selectedHospital.distance, color: "text-sky-600", bg: "bg-sky-50" },
                                            { icon: Activity, label: "Attente", value: selectedHospital.waitTime, color: "text-teal-600", bg: "bg-teal-50" },
                                            { icon: Calendar, label: "Prochain RDV", value: selectedHospital.nextAvailable, color: "text-violet-600", bg: "bg-violet-50" },
                                        ].map((item) => (
                                            <div key={item.label} className={`${item.bg} rounded-2xl p-5 space-y-2`}>
                                                <item.icon className={item.color} size={20} />
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                                                <p className="font-bold text-slate-800 text-sm">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tags */}
                                    <div className="glass-card p-5 border-white/70">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Services disponibles</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedHospital.tags.map((tag: string) => (
                                                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-slate-100 text-xs font-bold text-slate-700 shadow-sm">
                                                    <CheckCircle size={12} className="text-emerald-500" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "vaccines" && (
                                <motion.div key="vaccines" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <div className="glass-card p-6 border-white/70">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${selectedHospital.gradient} rounded-xl flex items-center justify-center text-white`}>
                                                <Shield size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-800">Vaccins Disponibles</h3>
                                                <p className="text-xs text-slate-500">Disponibilité déclarée · {selectedHospital.lastStockUpdate}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                             {selectedHospital.vaccineServices.map((vac: string, i: number) => {
                                                 const availability = selectedHospital.vaccineAvailability[vac] || "UNKNOWN";
                                                 const isLyophilized = lyophilizedVaccines.has(vac);
                                                 const sessionDay = selectedHospital.vaccineSessionDays[vac];
                                                const colors = [
                                                    "bg-sky-50 text-sky-700 border-sky-100",
                                                    "bg-violet-50 text-violet-700 border-violet-100",
                                                    "bg-teal-50 text-teal-700 border-teal-100",
                                                    "bg-rose-50 text-rose-700 border-rose-100",
                                                    "bg-amber-50 text-amber-700 border-amber-100",
                                                    "bg-emerald-50 text-emerald-700 border-emerald-100",
                                                ];
                                                return (
                                                    <div key={vac} className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${colors[i % colors.length]}`}>
                                                        <span className="flex items-center gap-2"><CheckCircle size={12} /> {vac}</span>
                                                         <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${availability === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : availability === "LOW" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                                                             {availability === "AVAILABLE" ? "Disponible" : availability === "LOW" ? "Stock faible" : "À confirmer"}
                                                         </span>
                                                         {isLyophilized && (
                                                             <span className="mt-2 flex items-start gap-1.5 rounded-lg bg-white/80 px-2 py-1.5 text-[9px] font-black leading-4 text-slate-700">
                                                                 <Calendar size={11} className="mt-0.5 shrink-0 text-violet-500" />
                                                                 {sessionDay
                                                                     ? `Séance : ${sessionDay}`
                                                                     : "Vaccin lyophilisé · jour à confirmer"}
                                                             </span>
                                                         )}
                                                     </div>
                                                 );
                                             })}
                                         </div>
                                         <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[10px] font-bold leading-4 text-amber-800">
                                             <Info size={14} className="mt-0.5 shrink-0" />
                                             Les jours affichés concernent surtout les vaccins lyophilisés. Planning indicatif : appelez le centre avant de vous déplacer.
                                         </p>
                                     </div>

                                    <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedHospital.gradient} text-white relative overflow-hidden`}>
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
                                        <Baby className="mb-3 opacity-90" size={32} />
                                        <h3 className="font-black text-lg mb-2">Programme EPI Gratuit</h3>
                                        <p className="text-white/80 text-sm leading-relaxed">
                                            Ce centre participe au Programme Élargi de Vaccination du Cameroun. Les vaccins du calendrier national sont gratuits pour tous les enfants de 0 à 5 ans.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "contact" && (
                                <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <div className="glass-card p-6 border-white/70 space-y-4">
                                        <h3 className="font-black text-slate-800">Informations de Contact</h3>
                                        {[
                                            { icon: MapPin, label: "Adresse", value: selectedHospital.address, color: "text-sky-600", bg: "bg-sky-50" },
                                            { icon: Phone, label: "Téléphone", value: selectedHospital.phone, color: "text-teal-600", bg: "bg-teal-50" },
                                            ...(selectedHospital.website ? [{ icon: Globe, label: "Site Web", value: selectedHospital.website, color: "text-violet-600", bg: "bg-violet-50" }] : []),
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                                                    <item.icon className={item.color} size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                                    <p className="font-bold text-slate-700 text-sm">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        <a href={`tel:${selectedHospital.phone}`}
                                            className={`flex items-center justify-center gap-3 py-5 rounded-2xl bg-gradient-to-br ${selectedHospital.gradient} text-white font-black text-sm shadow-xl hover:scale-105 transition-transform`}
                                        >
                                            <Phone size={18} /> Appeler
                                        </a>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.latitude},${selectedHospital.longitude}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-3 rounded-2xl bg-sky-50 py-5 text-sm font-black text-sky-700 shadow-sm transition-all hover:bg-sky-100"
                                        >
                                            <Navigation size={18} /> Itinéraire
                                        </a>
                                        <Link href="/alerts" className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 font-black text-sm shadow-sm hover:border-sky-200 hover:text-sky-600 transition-all">
                                            <Calendar size={18} /> Prendre RDV
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <>
            <div className="block lg:hidden">
                {mobileView === "map" ? (
                    <MapPage
                        onOpenHospitals={() => setMobileView("hospitals")}
                        onOpenHospital={(hospitalId) => {
                            const hospital = hospitals.find((item) => item.id === hospitalId);
                            if (hospital) selectHospital(hospital);
                            setMobileView("hospitals");
                        }}
                    />
                ) : hospitalContent}
            </div>
            <div className="hidden lg:block">
                {hospitalContent}
            </div>
        </>
    );
}
