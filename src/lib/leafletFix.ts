'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon SSR/module resolution issue for Next.js 16 / Turbopack
if (typeof window !== 'undefined') {
  // Delete the default icon URL getter so Leaflet doesn't try to auto-resolve from node_modules
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  // Manually point to the icons we placed in the public folder
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  });
}
