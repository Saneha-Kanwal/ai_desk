'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnimatedLogo from './AnimatedLogo';
import { authApi, getToken, User } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error: any) {
          // Silently handle auth errors (401/403) - user is just not logged in
          // Don't log errors that are suppressed or are expected auth failures
          if (!error.suppressLog && 
              error.message !== 'Not authenticated' && 
              !error.isAuthError &&
              error.response?.status !== 401 && 
              error.response?.status !== 403) {
            console.error('Error loading user:', error);
          }
          // Clear invalid token and user state
          authApi.logout();
          setUser(null);
        }
      } else {
        // No token, user is not logged in
        setUser(null);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-strong shadow-xl py-3' : 'bg-transparent py-4'
    }`}>
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative transform group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity animate-glow"></div>
              <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-xl p-2 shadow-2xl neon-border">
                <AnimatedLogo size="md" />
              </div>
            </div>
            <span className="text-2xl font-display font-bold gradient-text neon-glow group-hover:scale-105 transition-transform duration-300">
              AI Desk
            </span>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-32 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 glass rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[150px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
