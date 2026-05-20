'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { useEffect } from 'react';
import { Star } from 'lucide-react';
import type { School } from '@/lib/types';

const schoolMarkerIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:12px;height:12px;border-radius:50%;
    background:#E8694A;border:2.5px solid white;
    box-shadow:0 1px 4px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -8],
});

const userMarkerIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#1B2D5B;border:3px solid white;
    box-shadow:0 0 0 3px rgba(27,45,91,0.25);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

interface Props {
  schools: School[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
}

export default function MapView({ schools, center = [-15.78, -47.93], zoom = 5, userLocation }: Props) {
  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : center;

  return (
    <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          <RecenterMap center={[userLocation.lat, userLocation.lng]} />
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userMarkerIcon}>
            <Popup><p className="text-xs font-semibold text-navy">Você está aqui</p></Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={5000}
            pathOptions={{ color: '#1B2D5B', fillColor: '#1B2D5B', fillOpacity: 0.05, weight: 1.5, dashArray: '5,5' }}
          />
        </>
      )}

      {schools.map(school => (
        <Marker key={school.id} position={[school.lat, school.lng]} icon={schoolMarkerIcon}>
          <Popup maxWidth={260}>
            <div className="p-1 font-sans">
              <p className="font-bold text-sm text-navy mb-1">{school.name}</p>
              <p className="text-xs text-gray-500 mb-2">{school.neighborhood}, {school.city}</p>
              <div className="flex items-center gap-2 mb-2">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-xs">{school.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({school.reviewCount} avs)</span>
              </div>
              {school.avgPrice > 0 && (
                <p className="text-xs text-gray-600 mb-2">
                  Mensalidade: <strong>R$ {school.avgPrice.toLocaleString('pt-BR')}</strong>
                </p>
              )}
              <Link href={`/escola/${school.id}`}
                className="block text-center bg-coral text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:opacity-90 transition-opacity">
                Ver perfil
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
