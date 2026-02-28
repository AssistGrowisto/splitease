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
  payers?: { user_id: string; amount_paid: number }[];
  is_settlement: boolean;
}

interface BalanceMember {
  user_id: string;
  display_name: string;
  net_balance: number;
}

interface MemberInfo {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
}

interface Group {
  group_id: string;
  group_name: string;
  base_currency: string;
  status: string;
}

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balanceMembers, setBalanceMembers] = useState<BalanceMember[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      setIsLoading(true);

      const [groupRes, expensesRes, balancesRes, meRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`),
        fetch(`/api/groups/${groupId}/expenses`),
        fetch(`/api/groups/${groupId}/balances`),
        fetch('/api/auth/me'),
      ]);

      let memberList: MemberInfo[] = [];
      let currentUserId = '';

      if (meRes.ok) {
        const meResult = await meRes.json();
        currentUserId = meResult.data?.user?.user_id || '';
      }

      if (groupRes.ok) {
        const groupResult = await groupRes.json();
        const grp = groupResult.data?.group || groupResult;
        setGroup(grp);
        memberList = (groupResult.data?.members || []).map((m: any) => ({
          id: m.user_id || m.id,
          user_id: m.user_id || m.id,
          display_name: m.display_name || m.user_id || m.id,
          email: m.email || '',
        }));
        setMembers(memberList);
      }

      if (expensesRes.ok) {
        const expResult = await expensesRes.json();
        const expArray = Array.isArray(expResult.data?.expenses) ? expResult.data.expenses : [];
        expArray.sort((a: Expense, b: Expense) =>
          new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime()
        );
        setExpenses(expArray);
      }

      if (balancesRes.ok) {
        const balResult = await balancesRes.json();
        const balObj = balResult.data?.balances || {};

        // Build member lookup
        const memberMap: Record<string, string> = {};
        memberList.forEach((m) => {
          memberMap[m.user_id] = m.display_name;
        });

        // Convert {userId: amount} to array format with display names
        const balArray: BalanceMember[] = Object.entries(balObj).map(([userId, balance]) => ({
          user_id: userId,
          display_name: memberMap[userId] || userId,
          net_balance: balance as number,
        }));
        setBalanceMembers(balArray);

        // Set current user's balance
        if (currentUserId && balObj[currentUserId] !== undefined) {
          setUserBalance(balObj[currentUserId] as number);
        }
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

  const getPayerNames = (expense: Expense) => {
    if (!expense.payers || expense.payers.length === 0) return 'Unknown';
    return expense.payers.map((p) => {
      const member = members.find((m) => m.user_id === p.user_id);
      return member?.display_name || p.user_id;
    }).join(', ');
  };

  const getBalanceDisplay = () => {
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
                <Link key={expense.expense_id} href={`/groups/${groupId}/expenses/${expense.expense_id}`}>
                  <Card
                    className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
                      expense.is_settlement ? 'border-l-[#34A853]' : 'border-l-[#1A73E8]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-600 text-[#1B1B1F]">{expense.description}</h3>
                        <p className="text-xs text-[#5F6368] mt-1">
                          {getPayerNames(expense)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-600 text-[#1B1B1F]">
                          {expense.total_amount.toFixed(2)} {expense.currency}
                        </p>
                        <p className="text-xs text-[#5F6368]">{formatDate(expense.expense_date)}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </>
        ) : (
          <>
            {balanceMembers.length === 0 ? (
              <EmptyState
                icon="⚖️"
                title="No balances"
                description="Balances will appear once expenses are added"
              />
            ) : (
              <>
                {balanceMembers.map((member) => (
                  <Card key={member.user_id}>
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
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  );
}
