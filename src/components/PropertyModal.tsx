'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { DemoProperty } from '@/data/demoProperties';
import { getPropertyCoords } from '@/data/propertyCoordinates';
import { getCommuteInfo } from '@/utils/commute';

const MiniMap = dynamic(() => import('./map/MiniMap'), { ssr: false });

interface Props {
  property: DemoProperty;
  onClose: () => void;
}

export default function PropertyModal({ property, onClose }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookData, setBookData] = useState({ fullName: '', phone: '', email: '', date: '', time: '', message: '' });
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlisted(savedWishlist.includes(property.id));
    
    const savedCompare = JSON.parse(localStorage.getItem('compareList') || '[]');
    setIsComparing(savedCompare.includes(property.id));

    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [property.id, onClose]);

  const toggleWishlist = () => {
    const saved: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updated = wishlisted ? saved.filter(id => id !== property.id) : [...saved, property.id];
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlisted(!wishlisted);
  };

  const toggleCompare = () => {
    const list = JSON.parse(localStorage.getItem('compareList') || '[]');
    let newList;
    if (isComparing) {
      newList = list.filter((id: string) => id !== property.id);
    } else {
      if (list.length >= 3) {
        return alert('You can only compare up to 3 properties at once.');
      }
      newList = [...list, property.id];
    }
    localStorage.setItem('compareList', JSON.stringify(newList));
    window.dispatchEvent(new Event('compare-updated'));
    setIsComparing(!isComparing);
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return alert('Please enter a reason');
    setReportSubmitting(true);
    try {
      await fetch('/api/properties/report', {
        method: 'POST',
        body: JSON.stringify({ propertyId: property.id, reason: reportReason }),
      });
      alert('Listing reported successfully. Our team will review this.');
      setIsReporting(false);
    } catch (e) {
      alert('Failed to report listing.');
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleBookVisit = async () => {
    const { fullName, phone, email, date, time } = bookData;
    if (!fullName.trim() || !phone.trim() || !email.trim() || !date || !time) {
      alert('Please fill in all required fields (name, phone, email, date & time).');
      return;
    }
    setBookSubmitting(true);
    try {
      const res = await fetch('/api/book-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          propertyId: property.id,
          propertyTitle: property.title,
          date,
          time,
          message: bookData.message.trim(),
        }),
      });
      if (res.ok) {
        setBookSuccess(true);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch {
      alert('Network error. Please check your connection.');
    } finally {
      setBookSubmitting(false);
    }
  };

  const photoImages = property.images.filter(img => !img.url.includes('/video/'));
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        {/* Image Gallery */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-t-2xl">
          <Image
            src={photoImages[currentImage]?.url || property.imageUrl}
            alt={photoImages[currentImage]?.alt || property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {photoImages.map((_, i) => (
              <button key={i} onClick={() => setCurrentImage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImage ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
          {photoImages.length > 1 && (
            <>
              <button onClick={() => setCurrentImage(i => (i - 1 + photoImages.length) % photoImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors shadow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={() => setCurrentImage(i => (i + 1) % photoImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors shadow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </>
          )}
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

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
                {property.title}
                {commute && (
                  <span className={`text-xs ml-2 px-2.5 py-1 rounded-full font-bold border ${scoreColors[commute.score]}`}>
                    Commute Score: {commute.score}
                  </span>
                )}
              </h2>
              <p className="text-gray-500 flex items-center mt-2 flex-wrap gap-2">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {property.location}
                </span>
                {commute ? (
                  <span className="flex items-center gap-2 text-sm text-[#2d6a5e] bg-[#f8f6f1] px-2 py-0.5 rounded-full border border-[#e5e0d8]">
                    <span>📍 {commute.distanceStr} to UPES</span>
                    <span>🚶 {commute.walkingTimeMin}m</span>
                    <span>🚗 {commute.drivingTimeMin}m</span>
                  </span>
                ) : (
                  <span>· {property.distance} from campus</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-[#2d6a5e]">₹{property.price}</div>
              <span className="text-xs bg-green-50 text-[#2d6a5e] px-2 py-0.5 rounded-full font-medium">{property.details.gender}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{property.description}</p>

          {/* Amenities */}
          <div>
            <h3 className="font-bold text-[#1F2937] mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.filter(Boolean).map((a, i) => (
                <span key={i} className="text-xs bg-[#f8f6f1] text-[#2d6a5e] px-3 py-1.5 rounded-full font-medium border border-[#e5e0d8]">{a}</span>
              ))}
            </div>
          </div>

          {/* Features */}
          {property.details.features.length > 0 && (
            <div>
              <h3 className="font-bold text-[#1F2937] mb-3">Room Features</h3>
              <ul className="space-y-1.5">
                {property.details.features.map((f, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start">
                    <span className="text-[#2d6a5e] mr-2 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verification Metrics Desktop Banner */}
          <div className="bg-[#f8f6f1] p-4 rounded-xl border border-[#e5e0d8] flex flex-wrap gap-4 items-center justify-between">
             <div className="flex flex-wrap gap-4">
               {isOwnerVerified && (
                 <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                   <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg></div>
                   Identity Verified
                 </div>
               )}
               <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                 <div className="p-1.5 bg-green-100 text-green-600 rounded-full"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg></div>
                 Location Verified
               </div>
             </div>
             {isReporting ? (
               <div className="w-full mt-2 animate-fade-in flex flex-col gap-2">
                 <textarea
                   className="w-full text-sm border border-red-200 rounded-lg p-2 focus:ring-1 focus:ring-red-400 outline-none resize-none"
                   rows={2}
                   placeholder="Why are you reporting this listing? (e.g. Fake photos, Wrong location, Fraudulent)"
                   value={reportReason}
                   onChange={e => setReportReason(e.target.value)}
                 />
                 <div className="flex gap-2 justify-end">
                   <button onClick={() => setIsReporting(false)} className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                   <button onClick={handleReport} disabled={reportSubmitting} className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50">
                     {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                   </button>
                 </div>
               </div>
             ) : (
               <button onClick={() => setIsReporting(true)} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 font-medium transition-colors">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                 Report Listing
               </button>
             )}
          </div>

          {/* Contact + Wishlist */}
          <div className="flex flex-wrap gap-3 items-center pt-2">
            {!isBooking ? (
              <button onClick={() => setIsBooking(true)}
                className="flex-1 min-w-[200px] bg-[#2d6a5e] hover:bg-[#245a50] text-white rounded-xl px-6 py-3 font-semibold text-center transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Book a Visit
              </button>
            ) : bookSuccess ? (
              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-5 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                </div>
                <div>
                  <p className="font-bold text-green-800 text-base">Visit Request Submitted!</p>
                  <p className="text-green-600 text-sm mt-1">Your request is <span className="font-semibold bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full text-xs">Pending</span> — the owner will contact you shortly.</p>
                </div>
                <button onClick={() => { setIsBooking(false); setBookSuccess(false); setBookData({ fullName: '', phone: '', email: '', date: '', time: '', message: '' }); }}
                  className="text-xs text-green-700 font-semibold hover:underline">
                  Book another visit
                </button>
              </div>
            ) : (
              <div className="w-full bg-gray-50 p-5 rounded-xl border border-gray-200 animate-slide-up flex flex-col gap-3.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#1F2937] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#2d6a5e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Schedule a Visit
                  </h4>
                  <button onClick={() => setIsBooking(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={bookData.fullName}
                      onChange={e => setBookData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Riya Sharma"
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={bookData.phone}
                      onChange={e => setBookData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={bookData.email}
                    onChange={e => setBookData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@upes.ac.in"
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={bookData.date}
                      onChange={e => setBookData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Time <span className="text-red-500">*</span></label>
                    <input
                      type="time"
                      value={bookData.time}
                      onChange={e => setBookData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Message / Note <span className="text-gray-400">(optional)</span></label>
                  <textarea
                    value={bookData.message}
                    onChange={e => setBookData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Any specific requirements or questions for the owner..."
                    rows={2}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm resize-none"
                  />
                </div>

                <button
                  onClick={handleBookVisit}
                  disabled={bookSubmitting}
                  className="w-full bg-[#2d6a5e] hover:bg-[#245a50] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                >
                  {bookSubmitting ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Submit Visit Request</>
                  )}
                </button>
                <p className="text-center text-[10px] text-gray-400">You&apos;ll be contacted within 24 hours · Status tracked in your dashboard</p>
              </div>
            )}
            
            <a href={`tel:${property.contact.phone}`}
              className="rounded-xl px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              Call
            </a>
            <button onClick={toggleWishlist}
              className={`rounded-xl px-4 py-3 font-semibold transition-colors flex items-center gap-2 ${wishlisted ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            {/* Compare Button */}
            <button onClick={toggleCompare}
              className={`rounded-xl px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${isComparing ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              {isComparing ? 'Added to Compare' : 'Compare'}
            </button>
          </div>

          {/* Mini Map */}
          <div>
            <h3 className="font-bold text-[#1F2937] mb-3">Location</h3>
            <div className="h-56 rounded-xl overflow-hidden border border-[#e5e0d8]">
              <MiniMap lat={coords[0]} lng={coords[1]} title={property.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
