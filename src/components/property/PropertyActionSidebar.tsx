'use client';

import { useState, useEffect } from 'react';
import { DemoProperty } from '@/data/demoProperties';

export default function PropertyActionSidebar({ property }: { property: DemoProperty }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlisted(savedWishlist.includes(property.id));
  }, [property.id]);

  const toggleWishlist = () => {
    const saved: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updated = wishlisted ? saved.filter(id => id !== property.id) : [...saved, property.id];
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlisted(!wishlisted);
  };

  const handleBookVisit = async () => {
    if (!bookName || !bookPhone || !bookEmail || !bookDate || !bookTime) {
      return alert("Please fill all fields");
    }
    setBookSubmitting(true);
    try {
      const res = await fetch('/api/book-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookName,
          phone: bookPhone,
          email: bookEmail,
          propertyId: property.id,
          propertyTitle: property.title,
          date: bookDate,
          time: bookTime
        })
      });
      
      if (!res.ok) throw new Error("Failed");
      
      setBookSuccess(true);
      setTimeout(() => {
        setIsBooking(false);
        setBookSuccess(false);
      }, 3000);
    } catch (e) {
      alert('Failed to book visit');
    } finally {
      setBookSubmitting(false);
    }
  };

  return (
    <>
      <a href={`tel:${property.contact.phone}`} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        Call Owner
      </a>
      
      {!isBooking ? (
        <button onClick={() => setIsBooking(true)} className="w-full bg-[#2d6a5e] hover:bg-[#245a50] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Book a Visit
        </button>
      ) : bookSuccess ? (
        <div className="w-full bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3.5 font-semibold text-center flex items-center justify-center gap-2 mb-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          Visit Request Sent!
        </div>
      ) : (
        <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3 mb-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-bold text-[#1F2937]">Schedule Visit</h4>
            <button onClick={() => setIsBooking(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="flex flex-col gap-2">
            <input type="text" placeholder="Your Name" value={bookName} onChange={e => setBookName(e.target.value)} className="p-2.5 rounded-lg border focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm" />
            <input type="tel" placeholder="Your Phone" value={bookPhone} onChange={e => setBookPhone(e.target.value)} className="p-2.5 rounded-lg border focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm" />
            <input type="email" placeholder="Your Email" value={bookEmail} onChange={e => setBookEmail(e.target.value)} className="p-2.5 rounded-lg border focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm" />
            <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} className="p-2.5 rounded-lg border focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm" min={new Date().toISOString().split('T')[0]} />
            <input type="time" value={bookTime} onChange={e => setBookTime(e.target.value)} className="p-2.5 rounded-lg border focus:ring-2 focus:ring-[#2d6a5e] outline-none bg-white text-sm" />
          </div>
          <button onClick={handleBookVisit} disabled={bookSubmitting} className="w-full bg-[#2d6a5e] hover:bg-[#245a50] text-white py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50 mt-1">
            {bookSubmitting ? 'Requesting...' : 'Request Visit'}
          </button>
        </div>
      )}

      <button onClick={toggleWishlist} className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border ${wishlisted ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
        <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
    </>
  );
}
