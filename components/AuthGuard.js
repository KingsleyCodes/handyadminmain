// components/AuthGuard.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '@/app/lib/db'; // Path to your Firebase initialization file

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isDashboardRoute = pathname?.startsWith('/dashboard');

      if (!user && isDashboardRoute) {
        setAuthenticated(false);
        router.replace('/');
      } else if (user && pathname === '/') {
        setAuthenticated(true);
        router.replace('/dashboard');
      } else {
        setAuthenticated(!!user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D5C3E] mb-4"></div>
        <p className="text-slate-400 text-sm font-medium">Verifying Credentials...</p>
      </div>
    );
  }

  // Prevent flash of unauthenticated content
  if (!authenticated && pathname?.startsWith('/dashboard')) {
    return null;
  }

  return children;
}