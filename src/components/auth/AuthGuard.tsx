'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Prevent redirect loops by checking if we're already on the login page
      if (window.location.pathname.includes('/login')) {
        // If already on login page, redirect to home instead of creating a loop
        router.push('/');
        return;
      }
      
      const redirectPath = window.location.pathname === '/' ? '/admin/posts' : window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}