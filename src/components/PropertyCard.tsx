import Image from 'next/image';
import { DemoProperty } from '@/data/demoProperties';
import { getPropertyCoords } from '@/data/propertyCoordinates';
import { getCommuteInfo } from '@/utils/commute';

interface PropertyProps {
  property: DemoProperty;
  onClick?: (property: DemoProperty) => void;
  isHighlighted?: boolean;
}

export default function PropertyCard({ property, onClick, isHighlighted }: PropertyProps) {
  const coords = getPropertyCoords(property.location, parseInt(property.id.replace(/\D/g, '')) || 0);
  const commute = getCommuteInfo(coords[0], coords[1]);
  
  const scoreColors: Record<string, string> = {
    Excellent: 'bg-green-100 text-green-800 border-green-200',
    Good: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Far: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const isOwnerVerified = property.isOwnerVerified ?? (parseInt(property.id.replace(/\D/g, '')) % 3 !== 0);

  return (
    <div
      id={`card-${property.id}`}
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border group cursor-pointer animate-fade-in ${
        isHighlighted
          ? 'border-[#2d6a5e] ring-2 ring-[#2d6a5e]/30 shadow-xl scale-[1.02]'
          : 'border-[#e5e0d8]'
      }`}
      onClick={() => onClick?.(property)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-[#2d6a5e] shadow-sm w-max">
            {property.details.type}
          </div>
          {isOwnerVerified && (
            <div className="bg-blue-500/95 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 w-max">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Verified Owner
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 z-10">
          <span>📍 {commute?.distanceStr || property.distance}</span>
          {commute && <span>| 🚗 {commute.drivingTimeMin}m</span>}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-[#1F2937] mb-1 line-clamp-1 group-hover:text-[#2d6a5e] transition-colors">{property.title}</h3>
        <p className="text-xs text-gray-500 mb-2 flex items-center">
          <svg className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {property.location}
        </p>

        <div className="flex flex-wrap gap-1 mb-2">
          {property.safetyScore && (
            <span 
              title="Based on community feedback and verification"
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mr-1 ${
                property.safetyScore >= 4.0 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : property.safetyScore >= 3.5 
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                    : 'bg-red-100 text-red-800 border-red-200'
              }`}
            >
              ⭐ {property.safetyScore} / 5
            </span>
          )}
          {commute && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreColors[commute.score]} mr-1`}>
              Commute: {commute.score}
            </span>
          )}
          {property.amenities.slice(0, 3).map((a, i) => (
            <span key={i} className="text-[10px] bg-[#f8f6f1] text-[#2d6a5e] px-2 py-0.5 rounded-full font-medium border border-[#e5e0d8]">{a}</span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">+{property.amenities.length - 3}</span>
          )}
        </div>

        <div className="mt-auto pt-2 border-t border-[#e5e0d8] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{property.details.gender}</span>
            <div className="text-lg font-extrabold text-[#2d6a5e]">₹{property.price}</div>
          </div>
          <div className="bg-[#f8f6f1] text-[#2d6a5e] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#e5e0d8]">
            Details →
          </div>
        </div>
      </div>
    </div>
  );
}
