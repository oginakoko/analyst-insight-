
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, LogInIcon } from 'lucide-react';
// import Image from 'next/image'; // For Google icon, if desired

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingInEmail, setIsLoggingInEmail] = useState(false);
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const { user, signInWithGoogle, signInWithEmail, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirect);
    }
  }, [user, authLoading, router, redirect]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null);
    setIsLoggingInEmail(true);
    try {
      await signInWithEmail(email, password);
      // Successful login redirection is handled by useEffect
    } catch (err: any) {
      console.error("Email Sign-In error in LoginPage:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Failed to log in. Please try again later.');
      }
    }
    setIsLoggingInEmail(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoggingInGoogle(true);
    try {
      await signInWithGoogle();
      // Successful login redirection is handled by useEffect
    } catch (err: any) {
      console.error("Google Sign-In error in LoginPage:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google Sign-In was cancelled because the popup was closed.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-In. Please check the configuration or contact support.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Google Sign-In popup was blocked by the browser. Please disable your popup blocker and try again.');
      }
       else {
        setError('Failed to sign in with Google. Please try again.');
      }
    }
    setIsLoggingInGoogle(false);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user) { 
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <p>Already logged in. Redirecting...</p>
        <Loader2 className="ml-2 h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const isAnyLoginInProgress = isLoggingInEmail || isLoggingInGoogle;

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isAnyLoginInProgress}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isAnyLoginInProgress}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isAnyLoginInProgress || authLoading}>
              {isLoggingInEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogInIcon className="mr-2 h-4 w-4" />}
              Sign In with Email
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isAnyLoginInProgress || authLoading}>
             {isLoggingInGoogle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 381.7 512 244 512 110.3 512 0 401.7 0 265.9 0 129.6 100.5 17.8 234.9 2.6 246.1 0 257.5 0 267.9 0c29.9 0 58.2 7.9 82.3 21.8l-35.1 65.4c-12.3-6.6-26.5-10.1-42.1-10.1-55.9 0-102.5 45.1-102.5 100.9s46.6 100.9 102.5 100.9c37 0 66.7-15.8 83.9-37.2l69.7 41.5c-37.8 38.3-96.6 62.6-162.1 62.6C140.9 469.5 49.8 376.6 49.8 265.9c0-102.8 83.5-187.1 185.2-198.3 14.3-1.6 28.2-2.4 40.9-2.4 35.1 0 66.7 10.9 91.3 30.7l35.1-65.4C376.6 39.6 328.4 17.8 276.8 17.8c-13.5 0-26.5 1.4-38.9 3.9-72.6 15.4-124.4 77.3-124.4 152.3s52.1 136.9 124.4 152.3c12.2 2.6 25.9 4.1 40.6 4.1 47.1 0 89.5-17.8 121.2-47.9 29.6-28.2 46.9-68.5 46.9-113.1 0-10.9-1.4-21.8-3.9-32.6H276.8v-80.6h211.2c2.5 10.9 3.9 21.8 3.9 32.6z"></path>
              </svg>
            }
            Sign In with Google
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-center block">
          {/* Optional: Add link to sign up page if you implement it */}
          {/* <p>Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link></p> */}
        </CardFooter>
      </Card>
    </div>
  );
}
