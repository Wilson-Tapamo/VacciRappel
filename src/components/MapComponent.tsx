"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Fix for default marker icons in Leaflet with Next.js
const createHospitalIcon = (name: string, color: string) => {
    return L.divIcon({
        className: "custom-div-icon",
        html: `
            <div class="flex flex-col items-center group">
                <div class="relative">
                    <div class="w-10 h-10 ${color} rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <div class="w-2 h-2 ${color} rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/50 whitespace-nowrap transform transition-all duration-300 group-hover:scale-105">
                    <span class="text-[10px] font-black text-slate-800 uppercase tracking-tighter">${name}</span>
                </div>
            </div>
        `,
        iconSize: [40, 70],
        iconAnchor: [20, 45],
    });
};

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 15, { animate: true, duration: 1.5 });
    }, [center, map]);
    return null;
}

export default function MapComponent({ hospitals, selectedHospital, onSelectHospital }: any) {
    // Yaoundé coordinates
    const defaultCenter: [number, number] = [3.8480, 11.5021];
    
    // Fake coordinates for the demo
    const hospitalCoordinates: Record<number, [number, number]> = {
        1: [3.8645, 11.5302],
        2: [3.8812, 11.5098],
        3: [3.8350, 11.4850],
        4: [3.8200, 11.4900],
    };

    return (
        <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            scrollWheelZoom={true} 
            className="w-full h-full z-0"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            />
            
            {hospitals.map((h: any) => {
                const coords = hospitalCoordinates[h.id] || defaultCenter;
                const isSelected = selectedHospital?.id === h.id;
                
                return (
                    <Marker 
                        key={h.id} 
                        position={coords} 
                        icon={createHospitalIcon(h.name, h.pinColor || "bg-sky-500")}
                        eventHandlers={{ 
                            click: () => onSelectHospital(h)
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-xl ${h.pinColor} flex items-center justify-center text-white`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-800 text-sm leading-tight">{h.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.type}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black">
                                    <span className="text-emerald-500">⭐ {h.rating}</span>
                                    <span className="text-sky-500">{h.distance}</span>
                                </div>
                                <div className="mt-3 text-[9px] font-bold text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                                    "{h.open}"
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
            
            {selectedHospital && hospitalCoordinates[selectedHospital.id] && (
                <MapUpdater center={hospitalCoordinates[selectedHospital.id]} />
            )}
        </MapContainer>
    );
}

