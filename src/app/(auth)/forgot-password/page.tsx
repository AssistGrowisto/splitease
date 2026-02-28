'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <svg className="w-16 h-16 mx-auto mb-4 text-[#34A853]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-xl font-600 text-[#1B1B1F]">Check your email</h2>
        </div>

        <p className="text-[#5F6368]">
          A temporary password has been sent to <span className="font-500">{email}</span>
        </p>

        <Link
          href="/login"
          className="inline-block text-[#1A73E8] hover:text-[#1557B0] font-500 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-600 text-[#1B1B1F] mb-2">Reset Password</h2>
        <p className="text-[#5F6368] text-sm">Enter your email and we'll send you a temporary password.</p>
      </div>

      {error && (
        <div className="bg-[#F8D7DA] text-[#721C24] px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Send Temporary Password
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-[#1A73E8] hover:text-[#1557B0] text-sm font-500 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
}
