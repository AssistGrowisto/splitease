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
        const result = await response.json();
        const debtsList = result.data?.debts || result.debts || (Array.isArray(result) ? result : []);
        setDebts(debtsList);
      }
    } catch (error) {
      console.error('Failed to fetch debts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (debtId: string, amount: number) => {
    try {
      // Find the debt to get the to_user_id
      const debt = debts.find((d) => d.id === debtId);
      if (!debt) {
        throw new Error('Debt not found');
      }

      // Determine who to pay: if current user owes, pay the to_user; if current user is owed, the from_user pays
      const toUserId = debt.from_user_id === user?.user_id
        ? debt.to_user_id
        : debt.from_user_id;

      const response = await fetch(`/api/groups/${groupId}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_user_id: toUserId, amount }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Settlement failed');
      }

      showNotification('Payment recorded successfully', 'success');
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
            currentUserId={user.user_id}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
