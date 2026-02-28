'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const CheckMark = ({ checked }: { checked: boolean }) => (
    <span className={checked ? 'text-[#34A853]' : 'text-[#DADCE0]'}>
      ✓
    </span>
  );

  return (
    <div className="mt-2 space-y-1 text-xs">
      <div className="flex items-center gap-2">
        <CheckMark checked={checks.length} />
        <span className={checks.length ? 'text-[#34A853]' : 'text-[#5F6368]'}>
          At least 8 characters
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CheckMark checked={checks.uppercase} />
        <span className={checks.uppercase ? 'text-[#34A853]' : 'text-[#5F6368]'}>
          One uppercase letter
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CheckMark checked={checks.lowercase} />
        <span className={checks.lowercase ? 'text-[#34A853]' : 'text-[#5F6368]'}>
          One lowercase letter
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CheckMark checked={checks.digit} />
        <span className={checks.digit ? 'text-[#34A853]' : 'text-[#5F6368]'}>
          One number
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CheckMark checked={checks.special} />
        <span className={checks.special ? 'text-[#34A853]' : 'text-[#5F6368]'}>
          One special character
        </span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      await register(email, password, confirmPassword);
      router.push('/groups');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div>
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a strong password"
          showPasswordToggle
          required
        />
        {password && <PasswordStrengthIndicator password={password} />}
      </div>

      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        showPasswordToggle
        required
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Create Account
      </Button>

      <div className="text-center text-sm text-[#5F6368]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[#1A73E8] hover:text-[#1557B0] font-500 transition-colors"
        >
          Log In
        </Link>
      </div>
    </form>
  );
}
