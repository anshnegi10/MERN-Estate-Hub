'use client';

import dynamic from 'next/dynamic';

const MiniMap = dynamic(() => import('@/components/map/MiniMap'), { ssr: false });

export default function PropertyMapClient({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  return (
    <div className="h-[250px] rounded-xl overflow-hidden border border-[#e5e0d8]">
      <MiniMap lat={lat} lng={lng} title={title} />
    </div>
  );
}
