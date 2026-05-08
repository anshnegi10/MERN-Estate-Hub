'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        router.push('/profile');
      } else {
        setError(data.error || 'Invalid email or password. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }}>
      {/* ── Left Hero Panel ─────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0f2922 0%, #1a4a3a 40%, #2d6a5e 80%, #3d8a78 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7fffd4, transparent)' }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #adffe4, transparent)' }}
        />

        {/* Logo / Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-lg"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              🏠
            </div>
            <span className="text-2xl font-bold tracking-tight">EstateHub</span>
          </div>
          <p className="text-green-200 text-sm font-medium">UPES Student Housing Platform</p>
        </div>

        {/* Mid content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4" style={{ letterSpacing: '-0.5px' }}>
              Find Your Home<br />
              <span style={{ color: '#7fffd4' }}>Near UPES</span>
            </h1>
            <p className="text-green-100 text-base leading-relaxed max-w-xs">
              Verified hostels, flats, and PGs — all within 8 km of the Bidholi campus. Trusted by thousands of UPES students.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: '200+', label: 'Listings' },
              { val: '4.8★', label: 'Rating' },
              { val: '8 km', label: 'Max Radius' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="text-xl font-extrabold" style={{ color: '#7fffd4' }}>{s.val}</div>
                <div className="text-xs text-green-200 mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-sm text-green-100 leading-relaxed italic">
              &ldquo;Found my PG in 2 days — closest to UPES Bidholi gate. EstateHub saved me so much time!&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-xs font-bold text-green-900">K</div>
              <div>
                <p className="text-xs font-semibold text-white">Keshav Sharma 27</p>
                <p className="text-[10px] text-green-300">B.Tech CSE, UPES '27</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-xs text-green-400">
          © 2026 EstateHub
        </p>
      </div>

      {/* ── Right Login Panel ───────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 py-16 bg-[#f8f6f1]">
        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-[#1F2937]">EstateHub</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#1F2937] mb-2" style={{ letterSpacing: '-0.5px' }}>
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to access your UPES accommodation dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm font-medium">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-[#374151]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#2d6a5e] font-semibold hover:text-[#1a4a3a] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a5e] focus:border-transparent transition-all shadow-sm hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: loading ? '#5a9e8f' : 'linear-gradient(135deg, #2d6a5e 0%, #1a4a3a 100%)',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(45,106,94,0.4)',
              }}
              onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to EstateHub
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-bold text-[#2d6a5e] hover:text-[#1a4a3a] transition-colors hover:underline"
            >
              Create one free →
            </Link>
          </p>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: '🔒', label: 'Secure Login' },
              { icon: '✅', label: 'Verified Listings' },
              { icon: '🎓', label: 'UPES Focused' },
            ].map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-center"
              >
                <span className="text-lg">{b.icon}</span>
                <span className="text-[10px] text-gray-500 font-medium leading-tight">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
