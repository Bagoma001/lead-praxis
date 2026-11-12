'use client';

import { useState, FormEvent, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import {useLoginUser, useCurrentUser} from "@/api/Queries";

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const { mutate: login, isPending, error: mutationError } = useLoginUser();
  const {data: user} = useCurrentUser()

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    if (!email || !password) {
      return;
    }

    login({ email, password });

  };

  const demoAccounts = [
    { email: 'student@university.edu', role: 'Student', password: 'password123' },
    { email: 'lecturer@university.edu', role: 'Lecturer', password: 'password123' },
    { email: 'deptadmin@university.edu', role: 'Dept Admin', password: 'password123' },
    { email: 'admin@university.edu', role: 'Super Admin', password: 'password123' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">UniPortal</h1>
          </div>
          <p className="text-gray-600">University Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='text-black'
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={mutationError?.message}
               className='text-black'

              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Demo Accounts:</p>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <div
                    key={account.email}
                    className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <span className="font-medium">{account.role}:</span>{' '}
                      <span className="text-gray-600">{account.email}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEmail(account.email);
                        setPassword(account.password);
                      }}
                    >
                      Use
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">All passwords: password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
