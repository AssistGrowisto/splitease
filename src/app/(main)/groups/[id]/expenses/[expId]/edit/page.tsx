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
        const groupResult = await groupRes.json();
        const groupData = groupResult.data || groupResult;
        const rawMembers = groupData.members || [];
        const mappedMembers = rawMembers.map((m: any) => ({
          id: m.user_id || m.id,
          display_name: m.display_name || m.user_id || m.id,
          email: m.email || '',
        }));
        setGroupMembers(mappedMembers);
        const group = groupData.group || groupData;
        setBaseCurrency(group?.base_currency || 'INR');
      }

      if (expenseRes.ok) {
        const expResult = await expenseRes.json();
        const expData = expResult.data || expResult;
        const exp = expData.expense || expData;
        const payers = expData.payers || [];
        const splits = expData.splits || [];
        setInitialData({
          description: exp.description || '',
          amount: typeof exp.total_amount === 'number' ? exp.total_amount : parseFloat(exp.total_amount) || 0,
          currency: exp.currency || 'INR',
          date: exp.expense_date ? exp.expense_date.split('T')[0] : '',
          paid_by: payers[0]?.user_id || '',
          split_type: exp.split_type || 'equal',
          splits: splits.reduce((acc: any, s: any) => {
            const uid = s.user_id || s.member_id;
            acc[uid] = { member_id: uid, amount: typeof s.split_amount === 'number' ? s.split_amount : parseFloat(s.split_amount) || 0 };
            return acc;
          }, {}),
          receipt_url: exp.receipt_url,
        });
      }

      if (currenciesRes.ok) {
        const currResult = await currenciesRes.json();
        const rates = currResult.data?.rates || currResult.rates || currResult;
        if (Array.isArray(rates) && rates.length > 0) {
          setCurrencies(rates);
        }
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
