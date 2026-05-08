'use client';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import PropertyModal from '@/components/PropertyModal';
import { demoProperties, DemoProperty } from '@/data/demoProperties';
import type { MapViewHandle } from '@/components/map/MapView';
import { Property as PropertyInterface } from '@/types/property';

import MapView from '@/components/map/MapView';

// Derive property type from details.type field
function getPropertyCategory(p: DemoProperty): 'hostel' | 'flat' | 'pg' {
  const t = p.details?.type?.toLowerCase() || '';
  if (t.includes('hostel')) return 'hostel';
  if (t.includes('pg')) return 'pg';
  return 'flat';
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';
  const city = searchParams.get('city') || 'All';

  const [dbProperties, setDbProperties] = useState<DemoProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<DemoProperty | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'hostel' | 'flat'>('all');
  const [highlightedId, setHighlightedId] = useState<string | null>(searchParams.get('highlight'));
  const mapRef = useRef<MapViewHandle>(null);
  const cardListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProperties() {
        try {
            const res = await fetch('/api/properties');
            const data: PropertyInterface[] = await res.json();
            
            if (Array.isArray(data)) {
                const mapped: DemoProperty[] = data.map(p => ({
                    id: p.id,
                    title: p.name,
                    description: p.description || "",
                    location: p.location || p.city,
                    price: p.price.toLocaleString(),
                    distance: "0.5 km", // Default for demo
                    imageUrl: p.images?.[0] || "https://images.unsplash.com/photo-1554995207-c18c203602cb",
                    images: (p.images || []).map((url, i) => ({ id: `img-${i}`, url, alt: p.name })),
                    amenities: p.amenities || [],
                    contact: { 
                        name: p.contact?.name || "Owner", 
                        phone: p.contact?.phone || "9876543210" 
                    },
                    details: {
                        type: p.type === 'apartment' ? 'Flat' : p.type.charAt(0).toUpperCase() + p.type.slice(1),
                        gender: "Co-Ed",
                        roomTypes: [p.beds ? `${p.beds} BHK` : "Shared"],
                        features: p.specs?.map(s => `${s[0]}: ${s[1]}`) || []
                    },
                    isOwnerVerified: p.isOwnerVerified,
                    safetyScore: p.safetyScore || 4.0
                }));
                setDbProperties(mapped);
            }
        } catch (e) {
            console.error("Failed to fetch properties:", e);
        } finally {
            setLoading(false);
        }
    }
    fetchProperties();
  }, []);

  // Combine demo and DB properties
  let allProperties = [...dbProperties, ...demoProperties];

  // Apply filters
  let filtered = allProperties;

  if (query) {
    filtered = filtered.filter(p =>
      [p.title, p.location, p.description].some(f => f.toLowerCase().includes(query))
    );
  }
  if (city !== 'All') {
    filtered = filtered.filter(p => p.location.toLowerCase().includes(city.toLowerCase()));
  }
  if (typeFilter !== 'all') {
    filtered = filtered.filter(p => {
      const cat = getPropertyCategory(p);
      if (typeFilter === 'hostel') return cat === 'hostel';
      return cat === 'flat' || cat === 'pg'; // flats + PGs grouped together
    });
  }

  // When a card is clicked → fly map to that marker + open modal
  const handleCardClick = useCallback((property: DemoProperty) => {
    setHighlightedId(property.id);
    mapRef.current?.flyToProperty(property.id);
    setSelectedProperty(property);
  }, []);

  // When a map marker is clicked → highlight corresponding card + scroll to it
  const handleMarkerClick = useCallback((propertyId: string) => {
    setHighlightedId(propertyId);
    const el = document.getElementById(`card-${propertyId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (highlight) {
      setHighlightedId(highlight);
      setTimeout(() => {
        mapRef.current?.flyToProperty(highlight);
        const el = document.getElementById(`card-${highlight}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [searchParams]);

  const filterButtons = [
    { key: 'all' as const, label: 'All', icon: '🏠' },
    { key: 'hostel' as const, label: 'Hostel', icon: '🏨' },
    { key: 'flat' as const, label: 'Flat / PG', icon: '🏢' },
  ];

  if (loading) {
      return <div className="text-center py-20 text-gray-500 font-medium">Loading available properties...</div>;
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e0d8] pb-4">
        <div className="flex items-center gap-2">
          {filterButtons.map(f => (
            <button key={f.key} onClick={() => setTypeFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                typeFilter === f.key
                  ? 'bg-[#2d6a5e] text-white shadow-md'
                  : 'bg-[#f8f6f1] text-[#1F2937] border border-[#e5e0d8] hover:bg-white'
              }`}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* UPES Zone badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(15,41,34,0.9)',
              color: '#7fffd4',
              border: '1px solid rgba(127,255,212,0.3)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            UPES Zone Only
          </div>
          <span className="text-gray-500 font-medium bg-[#f8f6f1] px-3 py-1 rounded-full text-sm border border-[#e5e0d8]">
            {filtered.length} Results
          </span>
        </div>
      </div>

      {/* Side-by-side layout: cards left, map right */}
      <div className="flex gap-6 h-[calc(100vh-120px)] min-h-[600px]">
        {/* Left — Scrollable Card Grid */}
        <div ref={cardListRef} className="w-full lg:w-1/2 overflow-y-auto pr-2 space-y-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-[#e5e0d8]">
              <p className="text-xl text-gray-500 font-medium">No properties found.</p>
              <button onClick={() => { setTypeFilter('all'); window.location.href='/explore'; }}
                className="mt-4 text-[#2d6a5e] font-bold hover:underline">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={handleCardClick}
                  isHighlighted={highlightedId === property.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — Sticky Map */}
        <div className="hidden lg:block w-1/2 sticky top-0 h-full">
          <MapView
            ref={mapRef}
            properties={filtered}
            onViewDetails={setSelectedProperty}
            onMarkerClick={handleMarkerClick}
            highlightedId={highlightedId}
          />
        </div>
      </div>

      {/* Property Modal */}
      {selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}
    </>
  );
}

export default function ExplorePage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#f8f6f1] border border-[#e5e0d8] text-[#2d6a5e] text-sm font-semibold tracking-wide uppercase">
          Discover Places
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1F2937] tracking-tight font-[family-name:var(--font-cormorant)]">
          Find Your Perfect <span className="text-[#2d6a5e]">Home</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Explore top-rated student properties near <span className="font-semibold text-[#2d6a5e]">UPES Bidholi campus</span> — all within 8 km radius.
        </p>
        <div className="pt-2 pb-2 z-10 relative max-w-3xl mx-auto">
          <Suspense fallback={<div>Loading search...</div>}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<div className="text-center mt-10">Loading properties...</div>}>
        <ExploreContent />
      </Suspense>
    </div>
  );
}

