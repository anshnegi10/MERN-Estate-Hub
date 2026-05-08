'use client';

import { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import type { DemoProperty } from '@/data/demoProperties';

// Re-export the handle type so parents can use it
export type { MapViewHandle } from './MapViewInner';

// Define the exact props MapViewInner expects
interface Props {
  properties: DemoProperty[];
  onViewDetails: (property: DemoProperty) => void;
  onMarkerClick?: (propertyId: string) => void;
  highlightedId?: string | null;
}

// Dynamically import the Inner map component with SSR disabled.
// Leaflet uses the `window` object heavily, so it cannot be server-side rendered.
const MapViewInner = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => (
    <div 
      className="w-full h-full min-h-[400px] rounded-2xl bg-gray-100 flex items-center justify-center border border-[#e5e0d8]"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#2d6a5e] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#2d6a5e] font-semibold text-sm">Loading Map...</span>
      </div>
    </div>
  ),
});

/**
 * MapViewWrapper safely wraps the Leaflet Map in Next.js App Router
 * It forwards refs correctly to the dynamically imported component.
 */
const MapView = forwardRef<any, Props>((props, ref) => {
  return <MapViewInner {...props} ref={ref} />;
});

MapView.displayName = 'MapView';

export default MapView;
