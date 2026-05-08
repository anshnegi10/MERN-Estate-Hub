'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { demoProperties, DemoProperty } from '@/data/demoProperties';
import { getPropertyCoords } from '@/data/propertyCoordinates';
import { getCommuteInfo } from '@/utils/commute';

type ActionState = 'None' | 'Visited' | 'Interested' | 'Final Choice';

export default function ComparePage() {
  const [properties, setProperties] = useState<DemoProperty[]>([]);
  const [actions, setActions] = useState<Record<string, ActionState>>({});

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('compareList') || '[]');
    const items = demoProperties.filter(p => list.includes(p.id));
    setProperties(items);

    const savedActions = JSON.parse(localStorage.getItem('compareActions') || '{}');
    setActions(savedActions);
  }, []);

  const handleRemove = (id: string) => {
    const list = JSON.parse(localStorage.getItem('compareList') || '[]');
    const newList = list.filter((item: string) => item !== id);
    localStorage.setItem('compareList', JSON.stringify(newList));
    window.dispatchEvent(new Event('compare-updated'));
    setProperties(properties.filter(p => p.id !== id));
  };

  const handleAction = (id: string, action: ActionState) => {
    const newActions = { ...actions, [id]: action };
    setActions(newActions);
    localStorage.setItem('compareActions', JSON.stringify(newActions));
  };

  if (properties.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-4">Compare Properties</h1>
        <p className="text-gray-500 mb-8">You haven't added any properties to compare yet.</p>
        <Link href="/explore" className="bg-[#2d6a5e] text-white px-6 py-3 rounded-xl font-semibold">
          Explore Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1F2937] font-[family-name:var(--font-cormorant)] mb-2">Compare Properties</h1>
          <p className="text-gray-500">Side-by-side comparison of your shortlisted choices.</p>
        </div>
        <Link href="/explore" className="text-[#2d6a5e] font-semibold hover:underline">← Back to Search</Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-[#e5e0d8] p-6 hide-scrollbar mb-12">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <tbody>
            <tr>
              <th className="p-4 w-48 text-gray-400 font-semibold uppercase tracking-wider text-xs border-b border-r border-[#e5e0d8]">Property</th>
              {properties.map(p => (
                <td key={p.id} className="p-4 min-w-[300px] border-b border-[#e5e0d8] align-top relative group">
                  <button onClick={() => handleRemove(p.id)} className="absolute top-6 right-6 bg-white/90 text-red-500 p-1.5 rounded-full shadow-md z-10 hover:bg-red-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <div className="relative h-48 w-full rounded-xl overflow-hidden mb-3">
                    <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937] leading-tight mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.location}</p>
                </td>
              ))}
            </tr>
            
            <tr>
              <th className="p-4 text-gray-400 font-semibold uppercase tracking-wider text-xs border-b border-r border-[#e5e0d8]">Rent/Price</th>
              {properties.map(p => (
                <td key={p.id} className="p-4 border-b border-[#e5e0d8]">
                  <div className="text-xl font-extrabold text-[#2d6a5e]">₹{p.price}</div>
                </td>
              ))}
            </tr>

            <tr>
              <th className="p-4 text-gray-400 font-semibold uppercase tracking-wider text-xs border-b border-r border-[#e5e0d8]">Commute to UPES</th>
              {properties.map(p => {
                const coords = getPropertyCoords(p.location, parseInt(p.id.replace(/\D/g, '')) || 0);
                const commute = getCommuteInfo(coords[0], coords[1]);
                return (
                  <td key={p.id} className="p-4 border-b border-[#e5e0d8]">
                    {commute ? (
                      <div>
                        <div className="font-bold text-[#1F2937] mb-1">{commute.distanceStr}</div>
                        <div className="text-sm text-gray-600 mb-2">🚗 {commute.drivingTimeMin} min | 🚶 {commute.walkingTimeMin} min</div>
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                          commute.score === 'Excellent' ? 'bg-green-100 text-green-700' :
                          commute.score === 'Good' ? 'bg-emerald-100 text-emerald-700' :
                          commute.score === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          Score: {commute.score}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">{p.distance}</span>
                    )}
                  </td>
                );
              })}
            </tr>

            <tr>
              <th className="p-4 text-gray-400 font-semibold uppercase tracking-wider text-xs border-b border-r border-[#e5e0d8]">Safety Score</th>
              {properties.map(p => {
                const score = p.safetyScore || Math.floor(Math.random() * 4) + 6; // Mock if undefined
                return (
                  <td key={p.id} className="p-4 border-b border-[#e5e0d8]">
                    <div className="flex items-center gap-2">
                       <span className="text-lg font-bold">{score}/10</span>
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${score >= 8 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {score >= 8 ? 'Safe' : 'Moderate'}
                       </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr>
              <th className="p-4 text-gray-400 font-semibold uppercase tracking-wider text-xs border-b border-r border-[#e5e0d8]">Amenities</th>
              {properties.map(p => (
                <td key={p.id} className="p-4 border-b border-[#e5e0d8]">
                  <ul className="space-y-1">
                    {p.amenities.slice(0, 5).map((a, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5 before:content-['✓'] before:text-[#2d6a5e]">
                        {a}
                      </li>
                    ))}
                    {p.amenities.length > 5 && <li className="text-sm text-gray-400 italic">+{p.amenities.length - 5} more</li>}
                  </ul>
                </td>
              ))}
            </tr>

            <tr>
              <th className="p-4 text-gray-400 font-semibold uppercase tracking-wider text-xs border-r border-[#e5e0d8]">Your Status</th>
              {properties.map(p => {
                const currentAction = actions[p.id] || 'None';
                return (
                  <td key={p.id} className="p-4">
                    <select
                      value={currentAction}
                      onChange={(e) => handleAction(p.id, e.target.value as ActionState)}
                      className={`w-full p-2.5 rounded-lg border text-sm font-semibold outline-none transition-colors ${
                        currentAction === 'Final Choice' ? 'bg-green-50 border-green-300 text-green-700' :
                        currentAction === 'Interested' ? 'bg-blue-50 border-blue-300 text-blue-700' :
                        currentAction === 'Visited' ? 'bg-purple-50 border-purple-300 text-purple-700' :
                        'bg-gray-50 border-gray-300 text-gray-600'
                      }`}
                    >
                      <option value="None">Not Set</option>
                      <option value="Interested">👀 Interested</option>
                      <option value="Visited">✅ Visited</option>
                      <option value="Final Choice">🎯 Final Choice</option>
                    </select>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
