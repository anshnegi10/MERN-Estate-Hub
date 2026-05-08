'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileDetails from '@/components/profile/ProfileDetails';
import RequestsTab from '@/components/profile/RequestsTab';
import WishlistTab from '@/components/profile/WishlistTab';
import SettingsTab from '@/components/profile/SettingsTab';

type Tab = 'profile' | 'requests' | 'wishlist' | 'settings';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  useEffect(() => {
    // Try localStorage token first (set during login)
    const storedToken = localStorage.getItem('token');
    console.log('[Profile Page] Stored token found:', !!storedToken);

    if (storedToken) {
      setToken(storedToken);
    }

    // Always call /api/auth/me — it works via httpOnly cookie even without Bearer token
    // If localStorage token exists, send it as Bearer for explicit auth
    fetchProfile(storedToken || null);
  }, []);

  const fetchProfile = async (authToken: string | null) => {
    try {
      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/auth/me', { headers, credentials: 'include' });

      console.log('[Profile Page] /api/auth/me status:', res.status);

      if (res.status === 401) {
        // Token invalid or expired — clear storage and redirect
        console.warn('[Profile Page] Unauthorized — redirecting to login');
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }

      const data = await res.json();
      console.log('[Profile Page] User data received:', data.user?.email);

      if (res.ok && data.user) {
        setUser(data.user);
        // Keep token in sync if it came from cookie auth (no localStorage token)
        if (!authToken && data.user) {
          console.log('[Profile Page] Authenticated via httpOnly cookie');
        }
      } else {
        // No user data — redirect to login
        console.warn('[Profile Page] No user data in response, redirecting to login');
        localStorage.removeItem('token');
        router.replace('/login');
      }
    } catch (e) {
      console.error('[Profile Page] Failed to fetch profile:', e);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      console.log('[Profile Page] Logout successful');
    } catch (error) {
      console.error('[Profile Page] Logout request failed:', error);
    }
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <svg className="w-12 h-12 animate-spin text-[#2d6a5e] mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-red-500 font-medium mb-4">Failed to load profile. Please try logging in again.</p>
        <button onClick={handleLogout} className="px-4 py-2 bg-[#2d6a5e] text-white rounded-lg hover:bg-[#245a50] transition-colors">
          Go to Login
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f8f6f1] pt-8 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs font-semibold text-gray-500 mb-6 flex items-center gap-2">
          <span className="cursor-pointer hover:text-[#2d6a5e]" onClick={() => router.push('/explore')}>Home</span>
          <span>/</span>
          <span className="text-[#2d6a5e]">My Dashboard</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <ProfileSidebar 
            user={user} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onLogout={handleLogout} 
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-[#e5e0d8] p-6 sm:p-8 min-h-[500px]">
            {activeTab === 'profile' && (
              <ProfileDetails user={user} token={token} onUpdate={setUser} />
            )}
            
            {activeTab === 'requests' && (
              <RequestsTab token={token} />
            )}

            {activeTab === 'wishlist' && (
              <WishlistTab token={token} />
            )}

            {activeTab === 'settings' && (
              <SettingsTab token={token} />
            )}
          </main>
        </div>
        
      </div>
    </div>
  );
}
