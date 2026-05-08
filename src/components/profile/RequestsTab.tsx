'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BookingRequest {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  date: string;
  time: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Props {
  token: string;
}

export default function RequestsTab({ token }: Props) {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests);
      } else {
        setError(data.error || 'Failed to load requests');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this visit request?')) return;
    setCancellingId(id);
    try {
      const res = await fetch(`/api/requests/user?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRequests(requests.filter((r) => r._id !== id));
      } else {
        alert('Failed to cancel request');
      }
    } catch {
      alert('Network error');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <svg className="w-8 h-8 animate-spin text-[#2d6a5e]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-[#f8f6f1] rounded-2xl border border-[#e5e0d8]">
        <div className="text-4xl mb-3">📋</div>
        <h3 className="text-lg font-bold text-gray-800">No requests yet</h3>
        <p className="text-sm text-gray-500 mt-1 mb-5">You haven't booked any property visits yet.</p>
        <Link href="/explore" className="bg-[#2d6a5e] text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-[#1a4a3a] transition-all">
          Explore Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.3px' }}>
          My Requests
        </h2>
        <p className="text-sm text-gray-500 mt-1">Track and manage your property visit requests</p>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req._id} className="bg-white p-5 rounded-2xl border border-[#e5e0d8] flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#f8f6f1] flex items-center justify-center flex-shrink-0 text-xl border border-[#e5e0d8]">
              🏠
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 truncate">{req.propertyTitle}</h4>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                <span className="font-semibold text-gray-600">📅 {req.date}</span>
                <span className="text-gray-300">|</span>
                <span className="font-semibold text-gray-600">⏰ {req.time}</span>
              </p>
              {req.message && (
                <p className="text-xs text-gray-400 mt-1 truncate">Note: {req.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
              {req.status === 'pending' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                  ⏳ Pending
                </span>
              )}
              {req.status === 'approved' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                  ✅ Approved
                </span>
              )}
              {req.status === 'rejected' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                  ❌ Rejected
                </span>
              )}

              <div className="flex items-center gap-2">
                <Link href={`/property/${req.propertyId}`} className="text-xs font-semibold text-[#2d6a5e] bg-[#f8f6f1] px-3 py-1.5 rounded-lg hover:bg-[#e5e0d8] transition-colors border border-[#e5e0d8]">
                  View Property
                </Link>
                {req.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(req._id)}
                    disabled={cancellingId === req._id}
                    className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50"
                  >
                    {cancellingId === req._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
