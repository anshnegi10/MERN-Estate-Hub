'use client';

import { useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  createdAt: string;
}

type Tab = 'profile' | 'requests' | 'wishlist' | 'settings';

interface Props {
  user: User;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'profile',   label: 'My Profile',   icon: '👤' },
  { key: 'requests',  label: 'My Requests',  icon: '📋' },
  { key: 'wishlist',  label: 'Saved Homes',  icon: '❤️' },
  { key: 'settings',  label: 'Settings',     icon: '⚙️' },
];

export default function ProfileSidebar({ user, activeTab, onTabChange, onLogout }: Props) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleLabel = user.role === 'property_owner' ? 'Property Owner' : 'Student';
  const joined = new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <aside
      className="w-full lg:w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl"
      style={{ background: 'linear-gradient(160deg, #0f2922 0%, #1a4a3a 60%, #2d6a5e 100%)' }}
    >
      {/* Avatar + name */}
      <div className="px-6 py-8 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="relative inline-block mb-4">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-4"
              style={{ '--tw-ring-color': 'rgba(127,255,212,0.3)' } as React.CSSProperties}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #2d6a5e, #7fffd4)',
                color: '#0f2922',
              }}
            >
              {initials}
            </div>
          )}
          <div
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2"
            style={{ background: '#22c55e', borderColor: '#0f2922' }}
          />
        </div>

        <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{user.email}</p>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(127,255,212,0.15)',
              border: '1px solid rgba(127,255,212,0.3)',
              color: '#7fffd4',
            }}
          >
            🎓 {roleLabel}
          </span>
        </div>
        <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Member since {joined}</p>
      </div>

      {/* Nav tabs */}
      <nav className="px-3 py-4 space-y-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left"
            style={
              activeTab === t.key
                ? {
                    background: 'rgba(127,255,212,0.15)',
                    border: '1px solid rgba(127,255,212,0.25)',
                    color: '#7fffd4',
                  }
                : {
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid transparent',
                  }
            }
          >
            <span className="text-base">{t.icon}</span>
            {t.label}
            {activeTab === t.key && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 mt-auto border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ color: 'rgba(255,100,100,0.8)', border: '1px solid transparent' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)';
            (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,100,100,0.8)';
          }}
        >
          <span className="text-base">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
