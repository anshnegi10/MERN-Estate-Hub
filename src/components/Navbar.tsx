'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error("Invalid token", e);
      }
    } else {
      setUserRole(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/login');
  };

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    ...(userRole === 'owner' ? [{ href: '/submit-property', label: 'List Property' }] : [])
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#e5e0d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/explore" className="text-2xl font-bold text-[#2d6a5e] font-[family-name:var(--font-cormorant)]">
            EstateHub
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`font-medium transition-colors ${pathname === l.href ? 'text-[#2d6a5e]' : 'text-[#1F2937] hover:text-[#2d6a5e]'}`}>
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="text-[#1F2937] font-medium hover:text-[#2d6a5e]">Profile</Link>
                <button onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-[#2d6a5e] hover:bg-[#245a50] text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            <svg className="w-6 h-6 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-2 animate-fade-in">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-[#1F2937] hover:bg-[#f8f6f1] font-medium">{l.label}</Link>
            ))}
            {!isAuthenticated && (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 rounded-lg bg-[#2d6a5e] text-white font-medium text-center">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
