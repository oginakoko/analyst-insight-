'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only check and redirect once when loading is complete
    if (!loading) {
      if (!user) {
        router.replace('/login?redirect=/admin/latest-analysis');
      } else if (!isAdmin) {
        router.replace('/');
      }
    }
  }, [user, isAdmin, loading, router]);

  // Only show loading state for initial authentication check
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Immediately redirect unauthorized users
  if (!user || !isAdmin) {
    return null;
  }

  return <AuthGuard>{children}</AuthGuard>;
}