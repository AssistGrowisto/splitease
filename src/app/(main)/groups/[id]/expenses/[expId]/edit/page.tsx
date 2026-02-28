'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { Spinner } from '@/components/ui/Spinner';
import { useNotification } from '@/contexts/NotificationContext';

interface GroupMember {
  id: string;
  display_name: string;
  email: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface ExpenseData {
  description: string;
  amount: number;
  currency: string;
  date: string;
  paid_by: string;
  split_type: 'equal' | 'custom' | 'percentage';
  splits: Record<string, { member_id: string; amount: number }>;
  receipt_url?: string;
}

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const expenseId = params.expId as string;
  const { showNotification } = useNotification();

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [initialData, setInitialData] = useState<ExpenseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [groupId, expenseId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [groupRes, expenseRes, currenciesRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`),
        fetch(`/api/groups/${groupId}/expenses/${expenseId}`),
        fetch('/api/currencies'),
      ]);

      if (groupRes.ok) {
        const group = await groupRes.json();
        setGroupMembers(group.members || []);
        setBaseCurrency(group.base_currency);
      }

      if (expenseRes.ok) {
        const expense = await expenseRes.json();
        setInitialData({
          description: expense.description,
          amount: expense.amount,
          currency: expense.currency,
          date: expense.date,
          paid_by: expense.paid_by[0]?.user_id || '',
          split_type: expense.split_type || 'equal',
          splits: expense.splits.reduce((acc: any, s: any) => {
            acc[s.member_id] = { member_id: s.member_id, amount: s.amount };
            return acc;
          }, {}),
          receipt_url: expense.receipt_url,
        });
      }

      if (currenciesRes.ok) {
        const data = await currenciesRes.json();
        setCurrencies(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/expenses/${expenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      showNotification('Expense updated successfully', 'success');
      router.push(`/groups/${groupId}/expenses/${expenseId}`);
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

  if (!initialData) {
    return <div>Failed to load expense</div>;
  }

  return (
    <div className="pb-20 min-h-screen">
      <Header
        title="Edit Expense"
        backButton={{ onClick: () => router.back() }}
      />

      <div className="p-4">
        <ExpenseForm
          groupMembers={groupMembers}
          baseCurrency={baseCurrency}
          currencies={currencies}
          initialData={initialData}
          onSubmit={handleSubmit}
          isEdit
        />
      </div>
    </div>
  );
}
