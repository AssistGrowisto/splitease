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

const DEFAULT_CURRENCIES: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20B9' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '\u20AC' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00A3' }
];

export default function AddExpensePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { showNotification } = useNotification();

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [currencies, setCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);
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

      if (currenciesRes.ok) {
        const currResult = await currenciesRes.json();
        const rates = currResult.data?.rates || currResult.rates || [];
        
        if (Array.isArray(rates) && rates.length > 0 && rates[0].code) {
          setCurrencies(rates);
        } else {
          setCurrencies(DEFAULT_CURRENCIES);
        }
      } else {
        setCurrencies(DEFAULT_CURRENCIES);
      }
    } catch (error) {
      console.error('Failed to fetch group data:', error);
      setCurrencies(DEFAULT_CURRENCIES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      // Transform form data to match API schema
      const payers = [{
        user_id: formData.paid_by,
        amount_paid: formData.amount
      }];
      
      const splits = Object.values(formData.splits || {}).map((s: any) => ({
        user_id: s.member_id,
        split_amount: s.amount,
        split_percentage: formData.split_type === 'percentage' ? (s.amount / formData.amount * 100) : undefined
      }));
      
      const apiPayload = {
        description: formData.description,
        total_amount: formData.amount,
        currency: formData.currency,
        expense_date: new Date(formData.date).toISOString(),
        payers,
        splits,
        split_type: formData.split_type
      };

      const response = await fetch(`/api/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to add expense');
      }

      showNotification('Expense added successfully', 'success');
      router.push(`/groups/${groupId}`);
    } catch (error) {
      console.error('Failed to submit expense:', error);
      showNotification(error instanceof Error ? error.message : 'Failed to add expense', 'error');
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
