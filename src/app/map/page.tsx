"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    Search,
    Navigation,
    Star,
    Phone,
    Clock,
    ChevronRight,
    Filter,
    Maximize2
} from "lucide-react";

const hospitals = [
    {
        id: 1,
        name: "Hôpital Gynéco-Obstétrique",
        type: "Public",
        distance: "2.4 km",
        rating: 4.8,
        reviews: 124,
        open: "Ouvert 24h/24",
        address: "Quartier Ngousso, Yaoundé",
        tags: ["Vaccination", "Urgence", "Pédiatrie"]
    },
    {
        id: 2,
        name: "Clinique de l'Espoir",
        type: "Privé",
        distance: "4.1 km",
        rating: 4.5,
        reviews: 89,
        open: "Ferme à 20h00",
        address: "Bastos, Yaoundé",
        tags: ["Vaccination", "Check-up"]
    },
    {
        id: 3,
        name: "Centre de Santé d'Ebolowa",
        type: "Public",
        distance: "5.7 km",
        rating: 4.2,
        reviews: 56,
        open: "Ouvert 24h/24",
        address: "Zone Industrielle, Yaoundé",
        tags: ["Vaccination", "Maternité"]
    }
];

export default function MapPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="space-y-8 h-[calc(100vh-10rem)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Carte des Points de Santé</h1>
                    <p className="text-slate-500 mt-1">Trouvez le centre de vaccination le plus proche de chez vous.</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-10 overflow-hidden">
                {/* Map Interface (Mocked) */}
                <div className="flex-[2] bg-slate-200 rounded-[2.5rem] relative overflow-hidden group border border-white/50 shadow-2xl shadow-sky-900/10">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/11.501,3.848,12/800x600?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}')` }}
                    />

                    {/* Map Controls */}
                    <div className="absolute top-6 left-6 right-6 flex items-center gap-4">
                        <div className="flex-1 bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-xl flex items-center px-5 py-1">
                            <Search className="text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher un hôpital..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-4 px-3 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                        <button className="p-5 gradient-primary text-white rounded-2xl shadow-xl shadow-sky-400/40 hover:scale-105 transition-all">
                            <Navigation size={22} />
                        </button>
                    </div>

                    <button className="absolute bottom-6 right-6 p-4 glass rounded-2xl text-slate-600 hover:bg-white transition-all shadow-xl">
                        <Maximize2 size={22} />
                    </button>

                    {/* Animated Map Pins (Mock) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="relative"
                        >
                            <div className="bg-sky-500 p-3 rounded-2xl shadow-2xl shadow-sky-400/60 relative z-10">
                                <MapPin className="text-white" size={32} />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-black/30 blur-[4px] rounded-full scale-[0.8]" />
                        </motion.div>
                    </div>
                </div>

                {/* Hospital List */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">À proximité (12)</h3>
                        <button className="p-3 glass rounded-xl text-slate-500 hover:text-sky-600 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 space-y-6 no-scrollbar pb-10">
                        {hospitals.map((h) => (
                            <motion.div
                                key={h.id}
                                whileHover={{ y: -4 }}
                                className="glass-card p-6 border-white/60 shadow-xl shadow-sky-900/5 cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${h.type === 'Public' ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        {h.type}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-[11px] font-black">{h.rating}</span>
                                    </div>
                                </div>

                                <h4 className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">{h.name}</h4>
                                <p className="text-xs text-slate-400 font-medium mt-2 flex items-center gap-2">
                                    <MapPin size={14} className="text-sky-400" />
                                    {h.address}
                                </p>

                                <div className="mt-6 pt-6 border-t border-white/40 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-slate-400" />
                                            {h.open}
                                        </span>
                                        <span className="text-sky-600 font-black">
                                            {h.distance}
                                        </span>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-all">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <button className="w-full py-4 bg-slate-50 text-slate-500 text-sm font-bold rounded-2xl hover:bg-slate-100 transition-colors border-2 border-dashed border-slate-200">
                            Voir plus de résultats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
