'use client';

import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import MarkerClusterGroup from './MarkerClusterGroup';
import L from 'leaflet';
import '@/lib/leafletFix';
import Image from 'next/image';
import { DemoProperty } from '@/data/demoProperties';
import { getPropertyCoords } from '@/data/propertyCoordinates';
import { haversineDistance, UPES_COORDS } from '@/utils/distance';

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

/** Default blue marker for property listings */
const defaultIcon = new L.Icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/** Green marker for the highlighted / selected property */
const highlightIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/** Red/gold marker pinpointing UPES Dehradun */
const upesIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49],          // slightly larger so it stands out
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
});

// ---------------------------------------------------------------------------
// FlyToController — animates the map to fly to a marker
// ---------------------------------------------------------------------------

function FlyToController({
  flyToId,
  properties,
  onDone,
}: {
  flyToId: string | null;
  properties: DemoProperty[];
  onDone: () => void;
}) {
  const map = useMap();
  useEffect(() => {
    if (!flyToId) return;
    const idx = properties.findIndex((p) => p.id === flyToId);
    if (idx === -1) return;
    const coords = getPropertyCoords(
      properties[idx].location,
      parseInt(properties[idx].id.replace(/\D/g, '')) || idx,
    );
    map.flyTo(coords, 16, { duration: 1.2 });
    onDone();
  }, [flyToId, properties, map, onDone]);
  return null;
}

// ---------------------------------------------------------------------------
// Public handle type
// ---------------------------------------------------------------------------

export interface MapViewHandle {
  flyToProperty: (propertyId: string) => void;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  properties: DemoProperty[];
  onViewDetails: (property: DemoProperty) => void;
  onMarkerClick?: (propertyId: string) => void;
  highlightedId?: string | null;
}

const DEHRADUN_BOUNDS: L.LatLngBoundsExpression = [
  [30.2000, 77.8500], // South-West
  [30.5000, 78.2000]  // North-East
];

// ---------------------------------------------------------------------------
// MapView component
// ---------------------------------------------------------------------------

const MapViewInner = forwardRef<MapViewHandle, Props>(function MapViewInnerComponent(
  { properties, onViewDetails, onMarkerClick, highlightedId },
  ref,
) {
  const [flyToId, setFlyToId] = useState<string | null>(null);
  /** [lat, lng] of the property currently selected — draws a polyline from UPES */
  const [routeTo, setRouteTo] = useState<[number, number] | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useImperativeHandle(ref, () => ({
    flyToProperty(propertyId: string) {
      setFlyToId(propertyId);
    },
  }));

  const handleMarkerClick = useCallback(
    (propertyId: string, coords: [number, number]) => {
      onMarkerClick?.(propertyId);
      // Toggle off if the same marker is clicked twice
      setRouteTo((prev) =>
        prev && prev[0] === coords[0] && prev[1] === coords[1] ? null : coords,
      );
    },
    [onMarkerClick],
  );

  if (!isMounted) return null;

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-[#e5e0d8] shadow-lg" style={{ minHeight: '400px' }}>
      {/* UPES Zone badge */}
      <div
        className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg pointer-events-none"
        style={{
          background: 'rgba(15,41,34,0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(127,255,212,0.35)',
          color: '#7fffd4',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        📍 UPES Zone Only · ≤ 8 km
      </div>
      <MapContainer
        key="main-explore-map"
        center={UPES_COORDS}
        zoom={13}
        minZoom={11}
        maxZoom={18}
        maxBounds={DEHRADUN_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Base tile layer — OpenStreetMap                                   */}
        {/* ---------------------------------------------------------------- */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ---------------------------------------------------------------- */}
        {/* Fly-to animation controller                                       */}
        {/* ---------------------------------------------------------------- */}
        <FlyToController
          flyToId={flyToId}
          properties={properties}
          onDone={() => setFlyToId(null)}
        />

        {/* ---------------------------------------------------------------- */}
        {/* Fixed UPES Dehradun marker                                        */}
        {/* ---------------------------------------------------------------- */}
        <Marker position={UPES_COORDS} icon={upesIcon}>
          <Popup>
            <div className="flex flex-col gap-1 p-1 min-w-[180px]">
              <span className="text-base font-bold text-red-600">🎓 UPES Dehradun</span>
              <span className="text-xs text-gray-600 font-semibold">Bidholi Campus · Reference Point</span>
              <span className="text-xs text-gray-400">
                {UPES_COORDS[0].toFixed(4)}° N,&nbsp;
                {UPES_COORDS[1].toFixed(4)}° E
              </span>
              <div className="mt-1 px-2 py-1 rounded-full text-[10px] font-bold text-center" style={{ background: 'rgba(45,106,94,0.12)', color: '#2d6a5e' }}>
                All properties shown within 8 km radius
              </div>
            </div>
          </Popup>
        </Marker>

        {/* ---------------------------------------------------------------- */}
        {/* Route polyline — straight line from UPES to selected property     */}
        {/* ---------------------------------------------------------------- */}
        {routeTo && (
          <Polyline
            positions={[UPES_COORDS, routeTo]}
            pathOptions={{
              color: '#2d6a5e',
              weight: 3,
              opacity: 0.85,
              dashArray: '8 6',
            }}
          />
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Property markers (clustered)                                      */}
        {/* ---------------------------------------------------------------- */}
        <MarkerClusterGroup chunkedLoading>
          {properties.map((property, idx) => {
            const coords = getPropertyCoords(
              property.location,
              parseInt(property.id.replace(/\D/g, '')) || idx,
            );
            const isHighlighted = highlightedId === property.id;
            const distKm = haversineDistance(
              UPES_COORDS[0],
              UPES_COORDS[1],
              coords[0],
              coords[1],
            );

            return (
              <Marker
                key={property.id}
                position={coords}
                icon={isHighlighted ? highlightIcon : defaultIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(property.id, coords),
                }}
              >
                <Popup maxWidth={280} minWidth={240}>
                  <div className="flex flex-col gap-2 p-1">
                    {/* Property image */}
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                      <Image
                        src={property.imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="240px"
                      />
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-sm text-[#1F2937] leading-snug">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <p className="text-xs text-gray-500 -mt-1">
                      📍 {property.location}
                    </p>

                    {/* Rent + Distance row */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-extrabold text-[#2d6a5e] text-sm">
                        ₹{property.price}
                      </span>
                      <span className="bg-[#f0faf7] text-[#2d6a5e] border border-[#c6e6dc] px-2 py-0.5 rounded-full font-semibold">
                        🏫 {distKm} km from UPES
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(property);
                        }}
                        className="flex-1 bg-[#2d6a5e] text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-[#245a50] transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkerClick(property.id, coords);
                        }}
                        title={routeTo ? 'Clear route' : 'Show route from UPES'}
                        className="bg-[#f8f6f1] border border-[#e5e0d8] text-[#2d6a5e] text-xs px-2 py-1.5 rounded-lg font-semibold hover:bg-[#e5e0d8] transition-colors"
                      >
                        🗺️
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
});

export default MapViewInner;
