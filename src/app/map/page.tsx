"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Search, Navigation, Star, Phone, Clock,
    ChevronRight, Filter, Maximize2, Building2, Shield,
    Stethoscope, Heart, Baby, CheckCircle, Activity, X
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const hospitals = [
    {
        id: 1,
        name: "Hôpital Gynéco-Obstétrique",
        type: "Public",
        distance: "2.4 km",
        rating: 4.8,
        reviews: 124,
        open: "Ouvert 24h/24",
        openStatus: true,
        address: "Quartier Ngousso, Yaoundé",
        phone: "+237 222 21 48 64",
        tags: ["Vaccination", "Urgence", "Pédiatrie"],
        gradient: "from-sky-400 to-cyan-500",
        badge: "bg-sky-100 text-sky-700",
        pinColor: "bg-sky-500",
        waitTime: "~25 min"
    },
    {
        id: 2,
        name: "Clinique de l'Espoir",
        type: "Privé",
        distance: "4.1 km",
        rating: 4.5,
        reviews: 89,
        open: "Ferme à 20h00",
        openStatus: true,
        address: "Bastos, Yaoundé",
        phone: "+237 222 21 30 25",
        tags: ["Vaccination", "Check-up"],
        gradient: "from-violet-400 to-purple-500",
        badge: "bg-violet-100 text-violet-700",
        pinColor: "bg-violet-500",
        waitTime: "~15 min"
    },
    {
        id: 3,
        name: "Centre de Santé d'Ebolowa",
        type: "Public",
        distance: "5.7 km",
        rating: 4.2,
        reviews: 56,
        open: "Ouvert 24h/24",
        openStatus: true,
        address: "Zone Industrielle, Yaoundé",
        phone: "+237 222 28 14 90",
        tags: ["Vaccination", "Maternité"],
        gradient: "from-teal-400 to-emerald-500",
        badge: "bg-teal-100 text-teal-700",
        pinColor: "bg-teal-500",
        waitTime: "~40 min"
    }
];

export default function MapPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHospital, setSelectedHospital] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState("Tous");

    const filters = ["Tous", "Public", "Privé"];

    const filtered = hospitals.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "Tous" || h.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="relative w-full h-[calc(100vh-8rem)] lg:h-[calc(100vh-2rem)] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-50">
            {/* Interactive Leaflet Map */}
            <div className="absolute inset-0 z-0">
                <MapComponent 
                    hospitals={filtered} 
                    selectedHospital={selectedHospital} 
                    onSelectHospital={setSelectedHospital} 
                />
            </div>

            {/* Floating Top Bar (Search + Filters) */}
            <div className="absolute top-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-[600px] z-20 pointer-events-none flex flex-col gap-4">
                {/* Search */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-2 flex items-center gap-3 shadow-2xl border border-white/60 pointer-events-auto transition-all focus-within:shadow-sky-900/10 focus-within:bg-white">
                    <div className="w-12 h-12 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 shrink-0">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un point de santé..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="p-3 text-slate-400 hover:text-rose-500 transition-colors">
                            <X size={18} />
                        </button>
                    )}
                    <div className="w-[1px] h-8 bg-slate-200 mx-1" />
                    <button className="w-12 h-12 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 group">
                        <Navigation size={18} className="group-hover:text-sky-400 transition-colors" />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-2 pointer-events-auto overflow-x-auto no-scrollbar pb-2">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border border-white/50 ${activeFilter === f
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                                : 'bg-white/80 backdrop-blur-md text-slate-600 hover:bg-white shadow-sm'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Hospital Details Panel */}
            <AnimatePresence>
                {selectedHospital && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-6 left-6 right-6 lg:left-6 lg:right-auto lg:w-[400px] z-30"
                    >
                        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-2xl border border-white/80 pointer-events-auto flex flex-col gap-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className={`w-14 h-14 bg-gradient-to-br ${selectedHospital.gradient} rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shrink-0`}>
                                    <Building2 size={24} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="font-black text-slate-800 text-lg leading-tight">{selectedHospital.name}</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                                        <MapPin size={12} className="text-sky-500" /> {selectedHospital.address}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedHospital(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-2 rounded-xl text-xs font-black border border-amber-100/50">
                                    <Star size={14} fill="currentColor" /> {selectedHospital.rating}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl text-xs font-bold border border-slate-100">
                                    <Clock size={14} className="text-slate-400" /> {selectedHospital.waitTime}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl ${selectedHospital.badge}`}>
                                    {selectedHospital.type}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <a href={`tel:${selectedHospital.phone}`} className={`flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r ${selectedHospital.gradient} text-white text-xs font-black shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}>
                                    <Phone size={16} /> Appeler
                                </a>
                                <Link href={`/hospitals`} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 text-xs font-black shadow-sm hover:border-sky-200 hover:text-sky-600 transition-all">
                                    <ChevronRight size={16} /> Voir profil
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Map Centering Button */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
                <button className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-700 shadow-xl border border-white hover:bg-white hover:text-sky-500 transition-colors active:scale-95">
                    <Navigation size={22} className="rotate-45" />
                </button>
            </div>
        </div>
    );
}
