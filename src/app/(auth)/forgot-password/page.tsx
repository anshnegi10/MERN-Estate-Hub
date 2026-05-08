'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('OTP sent to your email');
        setStep(2);
      } else {
        setError(data.error || 'Email not found. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Password reset link sent to your email. You can now close this tab.');
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f6f1]" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }}>
      <div className="w-full flex flex-col justify-center items-center px-6 sm:px-12 py-16">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="flex items-center gap-2 mb-8 justify-center">
            <span className="text-3xl">🏠</span>
            <span className="text-2xl font-bold text-[#1F2937]">EstateHub</span>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-[#1F2937] mb-2" style={{ letterSpacing: '-0.5px' }}>
              {step === 1 ? 'Reset Password' : 'Enter OTP'}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === 1 
                ? "Enter your email address and we'll send you an OTP." 
                : `We sent a 6-digit OTP to ${email}.`}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm font-medium">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3.5 rounded-xl text-sm font-medium">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4.5 h-4.5" style={{width:'18px',height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@upes.ac.in"
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent transition-all shadow-sm hover:border-gray-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
                style={{
                  background: loading ? '#5a9e8f' : 'linear-gradient(135deg, #2d6a5e 0%, #1a4a3a 100%)',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(45,106,94,0.4)',
                }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">
                  6-Digit OTP
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4.5 h-4.5" style={{width:'18px',height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent transition-all shadow-sm hover:border-gray-300 tracking-widest font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success.includes('link sent')}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
                style={{
                  background: loading || success.includes('link sent') ? '#5a9e8f' : 'linear-gradient(135deg, #2d6a5e 0%, #1a4a3a 100%)',
                  boxShadow: loading || success.includes('link sent') ? 'none' : '0 4px 14px rgba(45,106,94,0.4)',
                }}
              >
                {loading ? 'Verifying...' : success.includes('link sent') ? 'Success' : 'Verify OTP'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-bold text-[#2d6a5e] hover:text-[#1a4a3a] transition-colors hover:underline"
            >
              Back to login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
