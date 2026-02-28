'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

interface Group {
  group_id: string;
  group_name: string;
  created_by: string;
  base_currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  user_balance?: number;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const status = activeTab === 'past' ? 'archived' : 'active';
      const response = await fetch(`/api/groups?status=${status}`);
      if (response.ok) {
        const result = await response.json();
        setGroups(result.data?.groups || result.groups || (Array.isArray(result) ? result : []));
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [activeTab]);

  const filteredGroups = groups.filter(g => 
    activeTab === 'past' ? g.status === 'archived' : g.status === 'active'
  );

  const getBalanceBadge = (balance?: number) => {
    if (!balance || balance === 0) {
      return <Badge variant="gray">Settled</Badge>;
    } else if (balance > 0) {
      return <Badge variant="green">You are owed {balance.toFixed(2)}</Badge>;
    } else if (balance < 0) {
      return <Badge variant="red">You owe {Math.abs(balance).toFixed(2)}</Badge>;
    }
  };

  return (
    <div className="pb-20 min-h-screen">
      <Header title="My Groups" />

      <div className="sticky top-14 z-20 bg-white border-b border-[#DADCE0] flex gap-4 px-4 py-2 overflow-x-auto">
        {(['active', 'past'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-500 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-[#1A73E8] text-[#1A73E8]'
                : 'border-transparent text-[#5F6368] hover:text-[#1B1B1F]'
            }`}
          >
            {tab === 'active' ? 'Active' : 'Past'}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            icon="ð¥"
            title="No groups yet"
            description={activeTab === 'active' 
              ? "Create one to start splitting expenses!" 
              : "You haven't archived any groups yet."}
            actionText={activeTab === 'active' ? 'Create Group' : undefined}
            onAction={activeTab === 'active' ? () => window.location.href = '/groups/new' : undefined}
          />
        ) : (
          filteredGroups.map((group) => (
            <Link key={group.group_id} href={`/groups/${group.group_id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-600 text-[#1B1B1F] text-base">{group.group_name}</h3>
                    <p className="text-sm text-[#5F6368] mt-1">
                      {group.member_count || 1} {(group.member_count || 1) === 1 ? 'member' : 'members'}
                    </p>
                  </div>
                  <div className="text-right">
                    {getBalanceBadge(group.user_balance)}
                    <p className="text-xs text-[#5F6368] mt-1">{group.base_currency}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* FAB Button */}
      {!isLoading && filteredGroups.length > 0 && activeTab === 'active' && (
        <Link
          href="/groups/new"
          className="fixed bottom-24 right-4 w-14 h-14 bg-[#1A73E8] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1557B0] transition-all"
          aria-label="Create new group"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
