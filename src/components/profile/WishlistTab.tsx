'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  price: string | number;
  type: string;
  images: string[];
  distanceFromUPES: number;
}

interface Props {
  token: string;
}

export default function WishlistTab({ token }: Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const fetchWishlist = async () => {
    try {
      // In this app, wishlist is stored in local storage
      const stored = localStorage.getItem('estatehub_wishlist');
      const propertyIds = stored ? JSON.parse(stored) : [];

      if (propertyIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      // Fetch enriched data from API
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ propertyIds })
      });

      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string) => {
    const updatedIds = properties.filter((p) => p.id !== id).map((p) => p.id);
    localStorage.setItem('estatehub_wishlist', JSON.stringify(updatedIds));
    setProperties(properties.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <svg className="w-8 h-8 animate-spin text-[#2d6a5e]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-[#f8f6f1] rounded-2xl border border-[#e5e0d8]">
        <div className="text-4xl mb-3">❤️</div>
        <h3 className="text-lg font-bold text-gray-800">No saved properties</h3>
        <p className="text-sm text-gray-500 mt-1 mb-5">You haven't added any properties to your wishlist yet.</p>
        <Link href="/explore" className="bg-[#2d6a5e] text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-[#1a4a3a] transition-all">
          Explore Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.3px' }}>
          Saved Homes
        </h2>
        <p className="text-sm text-gray-500 mt-1">Properties you've saved for later</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-2xl overflow-hidden border border-[#e5e0d8] shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-40 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={property.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#2d6a5e] shadow-sm">
                {property.type}
              </div>
              <button 
                onClick={() => handleRemove(property.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-sm"
                title="Remove from wishlist"
              >
                ❤️
              </button>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h4 className="font-bold text-gray-800 line-clamp-1">{property.title}</h4>
              <p className="text-[#2d6a5e] font-extrabold mt-1">
                {typeof property.price === 'number' ? `₹${property.price.toLocaleString()}` : property.price}
              </p>
              
              <div className="mt-2 mb-4 text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {property.distanceFromUPES} km from UPES
              </div>
              
              <Link href={`/property/${property.id}`} className="mt-auto block text-center w-full py-2 bg-[#f8f6f1] hover:bg-[#e5e0d8] text-[#2d6a5e] rounded-xl font-bold text-sm transition-colors border border-[#e5e0d8]">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
