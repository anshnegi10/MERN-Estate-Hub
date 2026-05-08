'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const CATEGORIES = [
  { val: 'all',        label: 'All Accoms',  emoji: '🏠' },
  { val: 'Hostel',     label: 'Hostel',      emoji: '🛏️' },
  { val: 'Flat',       label: 'Flat',        emoji: '🔑' },
  { val: 'Studio',     label: 'Studio',      emoji: '🏗️' },
  { val: 'budget',     label: 'Budget',      emoji: '💰' },
];

export const CITIES = ['All', 'Dehradun', 'Bidholi', 'Kandoli', 'Premnagar'];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('query') || "");
  const [city, setCity] = useState(searchParams.get('city') || "All");
  const [category, setCategory] = useState(searchParams.get('category') || "all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (city !== 'All') params.set('city', city);
    if (category !== 'all') params.set('category', category);
    
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-xl sm:rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex-grow w-full sm:w-auto pl-4">
        <input 
          type="text" 
          placeholder="Search by name, location, or builder..." 
          className="w-full bg-transparent outline-none text-[#1F2937] placeholder-gray-400 font-medium py-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div>
      
      <select 
         value={city} 
         onChange={(e) => setCity(e.target.value)}
         className="w-full sm:w-auto bg-transparent text-gray-600 font-medium py-3 px-4 outline-none appearance-none cursor-pointer border-t sm:border-t-0 border-gray-100"
      >
        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div>

      <select 
         value={category} 
         onChange={(e) => setCategory(e.target.value)}
         className="w-full sm:w-auto bg-transparent text-gray-600 font-medium py-3 px-4 outline-none appearance-none cursor-pointer border-t sm:border-t-0 border-gray-100"
      >
        {CATEGORIES.map(c => <option key={c.val} value={c.val}>{c.emoji} {c.label}</option>)}
      </select>

      <button type="submit" className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#22C55E] text-white rounded-lg sm:rounded-full px-8 py-3 transition-colors shadow-md font-bold mt-2 sm:mt-0 ml-1">
        Search
      </button>
    </form>
  );
}
