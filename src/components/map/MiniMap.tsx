'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '@/lib/leafletFix';

const icon = new L.Icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  lat: number;
  lng: number;
  title: string;
}

const DEHRADUN_BOUNDS: L.LatLngBoundsExpression = [
  [30.2000, 77.8500],
  [30.5000, 78.2000]
];

export default function MiniMap({ lat, lng, title }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (!lat || !lng) return null;

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '250px' }}>
      <MapContainer 
        key={`minimap-${lat}-${lng}`}
        center={[lat, lng]} 
        zoom={15} 
        minZoom={12}
        maxZoom={18}
        maxBounds={DEHRADUN_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>{title}</Popup>
      </Marker>
      </MapContainer>
    </div>
  );
}
