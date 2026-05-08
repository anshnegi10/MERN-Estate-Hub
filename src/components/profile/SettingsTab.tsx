'use client';

import { useState } from 'react';

interface Props {
  token: string;
}

export default function SettingsTab({ token }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    promotions: false
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.3px' }}>
          Account Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage your security and preferences</p>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]' : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'}`}>
          {msg.type === 'success' ? '✅ ' : '❌ '}{msg.text}
        </div>
      )}

      {/* Change Password Form */}
      <div className="bg-[#f8f6f1] p-6 rounded-2xl border border-[#e5e0d8]">
        <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span>🔒</span> Change Password
        </h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e5e0d8] text-sm bg-white focus:ring-2 focus:ring-[#2d6a5e] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e5e0d8] text-sm bg-white focus:ring-2 focus:ring-[#2d6a5e] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e5e0d8] text-sm bg-white focus:ring-2 focus:ring-[#2d6a5e] outline-none transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#2d6a5e] hover:bg-[#1a4a3a] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-[#f8f6f1] p-6 rounded-2xl border border-[#e5e0d8]">
        <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span>🔔</span> Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-bold text-gray-800">Email Alerts</p>
              <p className="text-xs text-gray-500">Get updates on your visit requests</p>
            </div>
            <input 
              type="checkbox" 
              checked={notifications.emailAlerts}
              onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})}
              className="w-5 h-5 accent-[#2d6a5e]" 
            />
          </label>
          <hr className="border-[#e5e0d8]" />
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-bold text-gray-800">SMS Alerts</p>
              <p className="text-xs text-gray-500">Get text messages for important updates</p>
            </div>
            <input 
              type="checkbox" 
              checked={notifications.smsAlerts}
              onChange={(e) => setNotifications({...notifications, smsAlerts: e.target.checked})}
              className="w-5 h-5 accent-[#2d6a5e]" 
            />
          </label>
          <hr className="border-[#e5e0d8]" />
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-bold text-gray-800">Promotions</p>
              <p className="text-xs text-gray-500">Receive offers and new listings</p>
            </div>
            <input 
              type="checkbox" 
              checked={notifications.promotions}
              onChange={(e) => setNotifications({...notifications, promotions: e.target.checked})}
              className="w-5 h-5 accent-[#2d6a5e]" 
            />
          </label>
        </div>
      </div>
    </div>
  );
}
