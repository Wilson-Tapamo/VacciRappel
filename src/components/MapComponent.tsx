"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 14, { animate: true });
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
            scrollWheelZoom={false} 
            className="w-full h-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {hospitals.map((h: any) => {
                const coords = hospitalCoordinates[h.id] || defaultCenter;
                return (
                    <Marker 
                        key={h.id} 
                        position={coords} 
                        eventHandlers={{ click: () => onSelectHospital(h) }}
                    >
                        <Popup>
                            <div className="font-bold text-sm text-slate-800">{h.name}</div>
                            <div className="text-xs text-slate-500 mt-1">{h.distance} · ⭐ {h.rating}</div>
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
