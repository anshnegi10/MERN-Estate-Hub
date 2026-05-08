import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { demoProperties } from '@/data/demoProperties';
import { getPropertyCoords } from '@/data/propertyCoordinates';
import { getCommuteInfo } from '@/utils/commute';
import PropertyMapClient from '@/components/property/PropertyMapClient';
import PropertyActionSidebar from '@/components/property/PropertyActionSidebar';
import FeedbackSummary from '@/components/feedback/FeedbackSummary';
import ReportSafetyButton from '@/components/feedback/ReportSafetyButton';

import { connectDB } from '@/database/connection';
import Feedback from '@/database/models/Feedback';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = demoProperties.find(p => p.id === params.id);
  
  if (!property) return notFound();

  await connectDB();
  const propertyFeedbacks = await Feedback.find({ propertyId: params.id }).sort({ createdAt: -1 }).lean();
  
  // Transform _id to string for Client Components
  const serializedFeedbacks = propertyFeedbacks.map((f: any) => ({
      _id: f._id.toString(),
      issueType: f.issueType,
      message: f.message,
      status: f.status,
      createdAt: f.createdAt.toISOString()
  }));

  const photoImages = property.images.filter(img => !img.url.includes('/video/'));
  const coords = getPropertyCoords(property.location, parseInt(property.id.replace(/\D/g, '')) || 0);
  const commute = getCommuteInfo(coords[0], coords[1]);
  const isOwnerVerified = property.isOwnerVerified ?? (parseInt(property.id.replace(/\D/g, '')) % 3 !== 0);

  const scoreColors: Record<string, string> = {
    Excellent: 'bg-green-100 text-green-800 border-green-200',
    Good: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Far: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const score = property.safetyScore || 0;
  let safetyColor = 'bg-green-100 text-green-800 border-green-200';
  let safetyText = 'Safe';
  if (score < 3.5) {
    safetyColor = 'bg-red-100 text-red-800 border-red-200';
    safetyText = 'Needs Attention';
  } else if (score < 4.0) {
    safetyColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    safetyText = 'Moderate';
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Back link */}
      <Link href="/explore" className="inline-flex items-center text-[#2d6a5e] mb-6 hover:underline font-semibold">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to Explore
      </Link>

      {/* Image Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-auto md:h-[500px]">
        <div className="md:col-span-2 relative h-[300px] md:h-full rounded-2xl overflow-hidden shadow-md">
          <Image src={photoImages[0]?.url || property.imageUrl} alt="Main" fill className="object-cover" />
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#2d6a5e] shadow-sm w-max">
              {property.details.type}
            </div>
            {isOwnerVerified && (
              <div className="bg-blue-500/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 w-max">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Verified Owner
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 md:col-span-1 gap-4 h-[150px] md:h-full">
          {photoImages.slice(1, 3).map((img, i) => (
            <div key={i} className="relative h-full rounded-2xl overflow-hidden shadow-md">
              <Image src={img.url} alt="Gallery image" fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 md:col-span-1 gap-4 h-[150px] md:h-full">
           {photoImages.slice(3, 5).map((img, i) => (
            <div key={i} className="relative h-full rounded-2xl overflow-hidden shadow-md">
              <Image src={img.url} alt="Gallery image" fill className="object-cover" />
            </div>
          ))}
           {photoImages.length < 4 && (
             <div className="relative h-full rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
               <span className="text-gray-400 font-bold">More coming soon</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1F2937] flex items-center gap-3">
                  {property.title}
                  {commute && (
                    <span className={`text-sm px-3 py-1 rounded-full font-bold border ${scoreColors[commute.score]}`}>
                      Score: {commute.score}
                    </span>
                  )}
                </h1>
                <p className="text-lg text-gray-500 mt-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {property.location}
                </p>
              </div>
              <div className="text-right">
                 <div className="text-3xl font-extrabold text-[#2d6a5e]">₹{property.price}</div>
                 <span className="inline-block mt-1 bg-green-50 text-[#2d6a5e] px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                   {property.details.gender} allowed
                 </span>
              </div>
            </div>

            {/* Commute Tag */}
            {commute ? (
              <div className="flex items-center gap-3 text-sm text-[#2d6a5e] bg-[#f8f6f1] p-3 rounded-xl border border-[#e5e0d8] font-medium w-max">
                <span>📍 {commute.distanceStr} to UPES</span>
                <span>🚶 {commute.walkingTimeMin} min walk</span>
                <span>🚗 {commute.drivingTimeMin} min drive</span>
              </div>
            ) : (
              <div className="text-gray-500">· {property.distance} from campus</div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1F2937] border-b pb-2 mb-4">About the Property</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1F2937] border-b pb-2 mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2.5">
              {property.amenities.map(a => (
                <span key={a} className="bg-[#f8f6f1] text-[#2d6a5e] px-4 py-2 rounded-full text-sm font-bold border border-[#e5e0d8]">{a}</span>
              ))}
            </div>
          </div>

          {property.details.features.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937] border-b pb-2 mb-4">Room Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.details.features.map((f, i) => (
                  <li key={i} className="text-gray-600 flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-[#2d6a5e] mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#1F2937]">Community Safety Rating</h2>
                  <p className="text-gray-500 mt-1">Based on student feedback and verified locality data.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${safetyColor}`}>
                    {safetyText}
                  </span>
                  <div className="text-3xl font-black text-[#2d6a5e]">
                    {score.toFixed(1)} <span className="text-lg text-gray-400 font-medium">/ 5</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Security</span>
                    <span className="text-[#2d6a5e] font-bold">{(score * 0.95).toFixed(1)}/5</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Lighting</span>
                    <span className="text-[#2d6a5e] font-bold">{(score * 0.9).toFixed(1)}/5</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Locality</span>
                    <span className="text-[#2d6a5e] font-bold">{(score * 1.05 > 5 ? 5 : score * 1.05).toFixed(1)}/5</span>
                  </div>
                </div>
              </div>
            </div>

            <FeedbackSummary feedbacks={serializedFeedbacks} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#e5e0d8] sticky top-24">
             <h3 className="text-xl font-bold text-[#1F2937] mb-4">Contact & Action</h3>
             <PropertyActionSidebar property={property} />
             
             <div className="mt-8">
                <h3 className="text-lg font-bold text-[#1F2937] mb-3">Location</h3>
                <PropertyMapClient lat={coords[0]} lng={coords[1]} title={property.title} />
             </div>

             <ReportSafetyButton propertyId={property.id} propertyName={property.title} />
           </div>
        </div>
      </div>
    </div>
  );
}
