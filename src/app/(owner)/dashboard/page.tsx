'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface Booking {
  _id: string;
  userId: string;
  propertyTitle: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Property {
  id: string;
  name: string;
  city: string;
  price: number;
}

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchDashboardData = async (uId: string) => {
    setLoading(true);
    try {
      // Fetch bookings for this owner
      const bRes = await fetch(`/api/bookings?ownerId=${uId}`);
      const bData = await bRes.json();
      if (bData.success) setBookings(bData.bookings);

      // Fetch properties for this owner
      const pRes = await fetch(`/api/properties?ownerId=${uId}`);
      const pData = await pRes.json();
      if (Array.isArray(pData)) setProperties(pData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      window.location.href = '/login';
      return;
    }
    try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUserId(payload.userId);
        fetchDashboardData(payload.userId);
    } catch (e) {
        window.location.href = '/login';
    }
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (userId) fetchDashboardData(userId);
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
        const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setProperties(properties.filter(p => p.id !== id));
        } else {
            alert("Failed to delete property");
        }
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1]">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-4xl font-extrabold text-[#1F2937] font-[family-name:var(--font-cormorant)]">
            Owner <span className="text-[#2d6a5e]">Dashboard</span>
            </h1>
            <Link href="/submit-property" className="bg-[#2d6a5e] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#1a4a3a] transition-all text-center">
                + List New Property
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Properties List */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-[#e5e0d8] p-6">
                    <h2 className="text-xl font-bold text-[#1F2937] mb-6 border-b pb-4">My Listings</h2>
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 italic">No properties listed yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {properties.map(p => (
                                <div key={p.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
                                    <h3 className="font-bold text-[#1F2937] truncate">{p.name}</h3>
                                    <p className="text-sm text-gray-500">{p.city} • ₹{p.price}</p>
                                    <div className="mt-3 flex gap-2">
                                        <button onClick={() => deleteProperty(p.id)} className="text-xs font-bold text-red-500 hover:text-red-700">Delete</button>
                                        <Link href={`/property/${p.id}`} className="text-xs font-bold text-[#2d6a5e] hover:underline">View</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bookings / Visit Requests */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl border border-[#e5e0d8] p-6 lg:p-8">
                <h2 className="text-xl font-bold text-[#1F2937] mb-6 border-b pb-4">Visit Requests</h2>

                {loading ? (
                    <div className="text-center text-gray-500 py-10">Loading requests...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No visit requests found.</div>
                ) : (
                    <div className="overflow-x-auto text-left">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <th className="pb-4">Property</th>
                            <th className="pb-4">Visitor/User</th>
                            <th className="pb-4">Date & Time</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map(b => (
                            <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 font-bold text-[#1F2937]">{b.propertyTitle}</td>
                            <td className="py-4 text-gray-600">{b.userId}</td>
                            <td className="py-4 text-gray-600">{b.date} at {b.time}</td>
                            <td className="py-4">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                b.status === 'approved' ? 'bg-green-100 text-green-700' :
                                b.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                                }`}>
                                {b.status.toUpperCase()}
                                </span>
                            </td>
                            <td className="py-4 text-right space-x-2">
                                {b.status === 'pending' ? (
                                <>
                                    <button onClick={() => updateStatus(b._id, 'approved')} className="bg-[#2d6a5e] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#245a50]">Approve</button>
                                    <button onClick={() => updateStatus(b._id, 'rejected')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-200">Reject</button>
                                </>
                                ) : (
                                <span className="text-gray-400 text-xs italic">Reviewed</span>
                                )}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

