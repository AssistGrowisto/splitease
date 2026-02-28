'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SettleForm } from '@/components/forms/SettleForm';
import { Spinner } from '@/components/ui/Spinner';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

interface SimplifiedDebt {
  id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  currency: string;
  from_user_name: string;
  to_user_name: string;
}

export default function SettleUpPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [debts, setDebts] = useState<SimplifiedDebt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDebts();
  }, [groupId]);

  const fetchDebts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}/balances/simplified`);
      if (response.ok) {
        const data = await response.json();
        setDebts(data);
      }
    } catch (error) {
      console.error('Failed to fetch debts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (debtId: string, amount: number) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debt_id: debtId, amount }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      showNotification('Payment recorded', 'success');
      await fetchDebts();
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen">
      <Header
        title="Settle Up"
        backButton={{ onClick: () => router.back() }}
      />

      <div className="p-4">
        {user && (
          <SettleForm
            debts={debts}
            currentUserId={user.id}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
