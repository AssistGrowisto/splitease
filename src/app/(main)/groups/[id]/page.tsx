'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';

interface Expense {
  expense_id: string;
  description: string;
  total_amount: number;
  currency: string;
  expense_date: string;
  payers?: any[];
  is_settlement: boolean;
  id?: string;
  amount?: number;
  date?: string;
  paid_by_names?: string[];
}

interface GroupMember {
  id: string;
  display_name: string;
  net_balance: number;
}

interface Group {
  group_id: string;
  group_name: string;
  base_currency: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<GroupMember[]>([]);
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      setIsLoading(true);

      const [groupRes, expensesRes, balancesRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`),
        fetch(`/api/groups/${groupId}/expenses`),
        fetch(`/api/groups/${groupId}/balances`),
      ]);

      if (groupRes.ok) {
        const groupResult = await groupRes.json();
        setGroup(groupResult.data?.group || groupResult);
      }
      if (expensesRes.ok) {
        const expResult = await expensesRes.json();
        const expArray = expResult.data?.expenses || expResult.expenses || (Array.isArray(expResult) ? expResult : []);
        setExpenses(expArray.sort((a: Expense, b: Expense) => 
          new Date(b.expense_date || b.date).getTime() - new Date(a.expense_date || a.date).getTime()
        ));
      }
      if (balancesRes.ok) {
        const balResult = await balancesRes.json();
        const balObj = balResult.data?.balances || {};
        // Convert {userId: amount} to array format
        const balArray = Object.entries(balObj).map(([id, balance]) => ({
          id,
          display_name: id,
          net_balance: balance as number
        }));
        setBalances(balArray);
      }
    } catch (error) {
      console.error('Failed to fetch group data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getBalanceDisplay = () => {
    const userBalance = 0; // TODO: compute from balances
    if (Math.abs(userBalance) < 0.01) {
      return {
        text: 'All settled',
        bgColor: 'bg-[#E9ECEF]',
        textColor: 'text-[#383D41]',
      };
    } else if (userBalance > 0) {
      return {
        text: `You are owed ${userBalance.toFixed(2)} ${group.base_currency}`,
        bgColor: 'bg-[#D4EDDA]',
        textColor: 'text-[#155724]',
      };
    } else {
      return {
        text: `You owe ${Math.abs(userBalance).toFixed(2)} ${group.base_currency}`,
        bgColor: 'bg-[#F8D7DA]',
        textColor: 'text-[#721C24]',
      };
    }
  };

  const balanceDisplay = getBalanceDisplay();

  return (
    <div className="pb-20 min-h-screen">
      <Header
        title={group.group_name}
        backButton={{ onClick: () => window.history.back() }}
        rightAction={
          <Link
            href={`/groups/${groupId}/settings`}
            className="text-[#1A73E8] hover:text-[#1557B0] transition-colors"
            aria-label="Group settings"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        }
      />

      {/* Balance Card */}
      <div className="p-4">
        <Card className={`${balanceDisplay.bgColor} ${balanceDisplay.textColor}`}>
          <p className="text-sm font-500 mb-1">Your Balance</p>
          <p className="text-2xl font-600">{balanceDisplay.text}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-[#DADCE0] flex gap-4 px-4 py-2">
        {(['expenses', 'balances'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-500 border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[#1A73E8] text-[#1A73E8]'
                : 'border-transparent text-[#5F6368] hover:text-[#1B1B1F]'
            }`}
          >
            {tab === 'expenses' ? 'Expenses' : 'Balances'}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {activeTab === 'expenses' ? (
          <>
            {expenses.length === 0 ? (
              <EmptyState
                icon="💰"
                title="No expenses yet"
                description="Add an expense to get started"
                actionText="Add Expense"
                onAction={() => window.location.href = `/groups/${groupId}/expenses/new`}
              />
            ) : (
              expenses.map((expense) => (
                <Link key={expense.expense_id || expense.id} href={`/groups/${groupId}/expenses/${expense.expense_id || expense.id}`}>
                  <Card
                    className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
                      expense.is_settlement ? 'border-l-[#34A853]' : 'border-l-[#1A73E8]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-600 text-[#1B1B1F]">{expense.description}</h3>
                        <p className="text-xs text-[#5F6368] mt-1">
                          {(expense.paid_by_names || []).join(', ') || 'You'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-600 text-[#1B1B1F]">
                          {(expense.total_amount || expense.amount || 0).toFixed(2)} {expense.currency}
                        </p>
                        <p className="text-xs text-[#5F6368]">{formatDate(expense.expense_date || expense.date)}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </>
        ) : (
          <>
            {balances.length === 0 ? (
              <EmptyState
                icon="⚖️"
                title="No balances"
                description="Balances will appear once expenses are added"
              />
            ) : (
              <>
                {balances.map((member) => (
                  <Card key={member.id}>
                    <div className="flex items-center justify-between">
                      <p className="font-500 text-[#1B1B1F]">{member.display_name}</p>
                      <Badge variant={member.net_balance > 0 ? 'green' : member.net_balance < 0 ? 'red' : 'gray'}>
                        {member.net_balance > 0
                          ? `Owed ${member.net_balance.toFixed(2)}`
                          : member.net_balance < 0
                            ? `Owes ${Math.abs(member.net_balance).toFixed(2)}`
                            : 'Settled'}
                      </Badge>
                    </div>
                  </Card>
                ))}

                <Link href={`/groups/${groupId}/settle`}>
                  <div className="mt-6">
                    <button className="w-full bg-[#1A73E8] text-white font-500 py-3 rounded-lg hover:bg-[#1557B0] transition-colors">
                      Settle Up
                    </button>
                  </div>
                </Link>
              </>
            )}
          </>
        )}
      </div>

      {/* FAB */}
      <Link
        href={`/groups/${groupId}/expenses/new`}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#1A73E8] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1557B0] transition-all"
        aria-label="Add expense"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  );
}
