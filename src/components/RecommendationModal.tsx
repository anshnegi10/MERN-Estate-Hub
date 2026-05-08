'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';
import { DemoProperty } from '@/data/demoProperties';

export default function RecommendationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState('20000');
  const [distance, setDistance] = useState('3');
  const [gender, setGender] = useState('any');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ property: DemoProperty, reasons: string[] } | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const router = useRouter();

  const amenitiesList = ['WiFi', 'AC', 'Washing Machine', 'Food', 'Gym', 'Parking'];

  const handleToggleAmenity = (am: string) => {
    setSelectedAmenities(prev => prev.includes(am) ? prev.filter(a => a !== am) : [...prev, am]);
  };

  const getRecommendation = async () => {
    setLoading(true);
    setResult(null);
    setNoMatch(false);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: parseInt(budget),
          distance: parseFloat(distance),
          gender,
          amenities: selectedAmenities,
        })
      });
      const data = await res.json();
      if (data.match) {
        setResult(data.match);
      } else {
        setNoMatch(true);
      }
    } catch (e) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed top-24 right-4 z-40 bg-gradient-to-r from-[#2d6a5e] to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-2.5 rounded-full shadow-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 border-2 border-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Smart Match
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
                <span className="text-yellow-400">✨</span> Smart AI Match
              </h2>
              <button onClick={() => setIsOpen(false)} className="bg-gray-100 text-gray-500 hover:text-gray-800 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {!result && !noMatch ? (
               <div className="space-y-5">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Max Budget (Monthly ₹)</label>
                   <input type="range" min="5000" max="60000" step="1000" value={budget} onChange={e => setBudget(e.target.value)} className="w-full accent-[#2d6a5e]" />
                   <div className="text-right text-[#2d6a5e] font-bold mt-1">₹{parseInt(budget).toLocaleString()} /mo</div>
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Max Distance from UPES (km)</label>
                   <input type="range" min="0.5" max="15" step="0.5" value={distance} onChange={e => setDistance(e.target.value)} className="w-full accent-[#2d6a5e]"/>
                   <div className="text-right text-[#2d6a5e] font-bold mt-1">{distance} km</div>
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Gender Preference</label>
                   <select value={gender} onChange={e => setGender(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-[#2d6a5e] transition-colors bg-gray-50">
                     <option value="any">Any / Don't Care</option>
                     <option value="boys">Boys</option>
                     <option value="girls">Girls</option>
                     <option value="co-ed">Co-Ed (Flat)</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Must-have Amenities</label>
                   <div className="flex flex-wrap gap-2">
                     {amenitiesList.map(am => (
                       <button
                         key={am}
                         onClick={() => handleToggleAmenity(am)}
                         className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedAmenities.includes(am) ? 'bg-[#2d6a5e] text-white border-[#2d6a5e]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}
                       >
                         {am}
                       </button>
                     ))}
                   </div>
                 </div>

                 <button 
                   onClick={getRecommendation}
                   disabled={loading}
                   className="w-full bg-[#2d6a5e] hover:bg-[#245a50] text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
                 >
                   {loading ? (
                     <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing match...</>
                   ) : 'Find My Perfect Match'}
                 </button>
               </div>
            ) : result ? (
               <div className="animate-fade-in">
                 <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <h3 className="font-extrabold text-green-800 mb-2 text-lg">🎯 Best Match Found!</h3>
                    <ul className="space-y-1">
                      {result.reasons.map((r, i) => (
                         <li key={i} className="text-sm text-green-700 flex items-start gap-1.5">
                           <span>✓</span> {r}
                         </li>
                      ))}
                    </ul>
                 </div>
                 <div className="relative group cursor-pointer transition-transform hover:scale-[1.02] duration-300">
                   <div className="absolute inset-0 z-10" onClick={() => router.push(`/property/${result.property.id}`)}></div>
                   <PropertyCard property={result.property} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 mt-4 z-20 relative">
                   <button onClick={() => router.push(`/property/${result.property.id}`)} disabled={!result.property.id} className="bg-[#2d6a5e] hover:bg-[#245a50] text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed">
                     View Full Details
                   </button>
                   <button onClick={() => setShowQuickView(true)} disabled={!result.property.id} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl text-sm font-bold transition-colors border border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                     Quick View
                   </button>
                   <button onClick={() => { setIsOpen(false); router.push(`/explore?highlight=${result.property.id}`); }} disabled={!result.property.id} className="col-span-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 py-2.5 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2 shadow-sm disabled:text-gray-400 disabled:bg-gray-100 disabled:border-transparent disabled:cursor-not-allowed">
                     📍 View on Map
                   </button>
                 </div>
                 
                 <button onClick={() => setResult(null)} className="w-full mt-3 text-gray-500 hover:text-gray-800 py-2 rounded-xl text-sm font-bold transition-colors underline">
                   Refine Search Criteria
                 </button>
               </div>
            ) : (
               <div className="text-center py-10">
                 <div className="text-4xl mb-4">🤷</div>
                 <h3 className="text-lg font-bold text-gray-800 mb-2">No exact matches</h3>
                 <p className="text-gray-500 mb-6">Try relaxing your distance or budget constraints.</p>
                 <button onClick={() => setNoMatch(false)} className="bg-[#2d6a5e] text-white px-6 py-2 rounded-xl font-bold">
                   Go Back
                 </button>
               </div>
            )}
          </div>
        </div>
      )}
      
      {showQuickView && result && (
        <PropertyModal property={result.property} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}
