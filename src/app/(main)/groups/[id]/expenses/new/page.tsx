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

export default function AddExpensePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { showNotification } = useNotification();

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      setIsLoading(true);

      const [groupRes, currenciesRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`),
        fetch('/api/currencies'),
      ]);

      if (groupRes.ok) {
        const group = await groupRes.json();
        setGroupMembers(group.members || []);
        setBaseCurrency(group.base_currency);
      }

      if (currenciesRes.ok) {
        const data = await currenciesRes.json();
        setCurrencies(data);
      }
    } catch (error) {
      console.error('Failed to fetch group data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      showNotification('Expense added successfully', 'success');
      router.push(`/groups/${groupId}`);
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
        title="Add Expense"
        backButton={{ onClick: () => router.back() }}
      />

      <div className="p-4">
        <ExpenseForm
          groupMembers={groupMembers}
          baseCurrency={baseCurrency}
          currencies={currencies}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
