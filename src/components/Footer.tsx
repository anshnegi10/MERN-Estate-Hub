'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0a1f18',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
      className="text-white pt-16 pb-8"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* LEFT SECTION */}
          <div className="space-y-5">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight transition-all duration-300 hover:text-[#7fffd4]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7fffd4] transition-all duration-300 hover:scale-110">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              EstateHub
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Built for students, focused on trusted campus housing. Simple, reliable, and designed for university life.
            </p>
            <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-[#7fffd4]/10 text-[#7fffd4] border border-[#7fffd4]/20">
              #1 UPES Student Housing Platform
            </div>
          </div>

          {/* MIDDLE LEFT (Quick Links) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="inline-block text-sm transition-all duration-300 hover:text-[#7fffd4] hover:scale-105 hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-block text-sm transition-all duration-300 hover:text-[#7fffd4] hover:scale-105 hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="inline-block text-sm transition-all duration-300 hover:text-[#7fffd4] hover:scale-105 hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* MIDDLE RIGHT (Policies) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="inline-block text-sm transition-all duration-300 hover:text-[#7fffd4] hover:scale-105 hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* RIGHT SECTION (Contact) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Contact</h3>
            <div className="space-y-4">
              <a 
                href="mailto:estatehub33@gmail.com" 
                className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-[#7fffd4]/10 group-hover:border-[#7fffd4]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 group-hover:text-[#7fffd4] transition-colors duration-300">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <span className="text-sm transition-colors duration-300 group-hover:text-[#7fffd4]" style={{ color: 'rgba(255,255,255,0.7)' }}>estatehub33@gmail.com</span>
              </a>

              <a 
                href="https://wa.me/919899530210"
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-[#25D366]/10 group-hover:border-[#25D366]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-[#25D366] transition-all duration-300">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </div>
                <span className="text-sm transition-colors duration-300 group-hover:text-[#25D366]" style={{ color: 'rgba(255,255,255,0.7)' }}>+91 98995 30210</span>
              </a>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>UPES, Dehradun</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div 
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="text-xs font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © 2026 EstateHub · UPES, Dehradun, India
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs transition-all duration-300 hover:text-white hover:scale-105" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
