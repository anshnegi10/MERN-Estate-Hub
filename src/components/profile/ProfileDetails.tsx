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

interface Props {
  user: User;
  token: string;
  onUpdate: (updated: User) => void;
}

export default function ProfileDetails({ user, token, onUpdate }: Props) {
  const [editing, setEditing]     = useState(false);
  const [name, setName]           = useState(user?.name || '');
  const [phone, setPhone]         = useState(user?.phone || '');
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');
  const [saveError, setSaveError] = useState('');

  const roleLabel = user?.role === 'property_owner' ? 'Property Owner' : 'Student';
  const joined    = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) : 'Loading...';
  
  const userIdShort = user?._id?.slice(-6)?.toUpperCase() || "N/A";

  const handleSave = async () => {
    if (!name.trim()) { setSaveError('Name cannot be empty'); return; }
    setSaving(true);
    setSaveError('');
    setSaveMsg('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUpdate(data.user);
        setSaveMsg('Profile updated successfully!');
        setEditing(false);
      } else {
        setSaveError(data.error || 'Failed to update profile');
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setEditing(false);
    setSaveError('');
  };

  const InfoRow = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <div
      className="flex items-start gap-4 p-4 rounded-xl"
      style={{ background: '#f8f6f1', border: '1px solid #e5e0d8' }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
        style={{ background: 'rgba(45,106,94,0.1)' }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 break-all">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900" style={{ letterSpacing: '-0.3px' }}>
            My Profile
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
            style={{ background: '#2d6a5e', color: '#fff' }}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Success banner */}
      {saveMsg && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
          ✅ {saveMsg}
        </div>
      )}

      {/* Info Cards or Edit Form */}
      {!editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow label="Full Name"     value={user?.name || "Loading..."}                icon="👤" />
          <InfoRow label="Email Address" value={user?.email || "Loading..."}               icon="📧" />
          <InfoRow label="Phone Number"  value={user?.phone || 'Not set'}  icon="📱" />
          <InfoRow label="Account Role"  value={roleLabel || "Loading..."}                icon="🎓" />
          <InfoRow label="Member Since"  value={joined}                   icon="📅" />
          <InfoRow label="User ID"       value={`#${userIdShort}`} icon="🔑" />
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{ background: '#f8f6f1', border: '1px solid #e5e0d8' }}
        >
          <h3 className="font-bold text-gray-800">Edit Your Details</h3>

          {saveError && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e] transition-all"
                style={{ borderColor: '#e5e0d8' }}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e] transition-all"
                style={{ borderColor: '#e5e0d8' }}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Email (cannot change)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border text-sm cursor-not-allowed"
                style={{ background: '#f0ede8', borderColor: '#e5e0d8', color: '#9ca3af' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Role (cannot change)</label>
              <input
                type="text"
                value={roleLabel}
                disabled
                className="w-full px-4 py-3 rounded-xl border text-sm cursor-not-allowed"
                style={{ background: '#f0ede8', borderColor: '#e5e0d8', color: '#9ca3af' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2d6a5e, #1a4a3a)', boxShadow: '0 4px 12px rgba(45,106,94,0.35)' }}
            >
              {saving ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg> Saving…</>
              ) : '💾 Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-all"
              style={{ background: '#e5e0d8' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Requests', val: '—', icon: '📋' },
          { label: 'Saved Properties', val: '—', icon: '❤️' },
          { label: 'Days Active', val: user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000).toString() : '—', icon: '📅' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{ background: 'linear-gradient(135deg, #0f2922, #1a4a3a)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-lg font-extrabold text-white">{s.val}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
