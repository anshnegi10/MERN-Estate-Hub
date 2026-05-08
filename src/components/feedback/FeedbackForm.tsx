'use client';
import { useState } from 'react';

interface FeedbackFormProps {
  propertyId: string;
  propertyName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FeedbackForm({ propertyId, propertyName, onClose, onSuccess }: FeedbackFormProps) {
  const [issueType, setIssueType] = useState('Security');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const issueTypes = [
    'Security',
    'Cleanliness',
    'Lighting',
    'Staff Behavior',
    'Maintenance',
    'Noise',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Message is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/property-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          propertyName,
          issueType,
          message,
          name,
          email,
          anonymous
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f8f6f1]">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Report Safety Concern</h2>
            <p className="text-sm text-gray-500 mt-1">Help improve safety for other students at {propertyName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200 flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Type *</label>
              <select 
                value={issueType} 
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none bg-white text-gray-900"
              >
                {issueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Details *</label>
              <textarea 
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe the safety issue in detail..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent outline-none resize-none text-gray-900"
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-400 mt-1">{message.length}/1000</div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer group mb-4">
                <input 
                  type="checkbox" 
                  checked={anonymous} 
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 text-[#2d6a5e] rounded focus:ring-[#2d6a5e] cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#2d6a5e] transition-colors">Submit anonymously</span>
              </label>

              {!anonymous && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@upes.ac.in"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#2d6a5e] outline-none text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #2d6a5e 0%, #1a4a3a 100%)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
