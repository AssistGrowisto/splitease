'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';

interface Activity {
  id?: string;
  activity_log_id?: string;
  group_id: string;
  group_name: string;
  user_name?: string;
  user_display_name?: string;
  action: string;
  description?: string;
  details?: any;
  timestamp: string;
  expense_id?: string;
  related_expense_id?: string;
  is_read?: boolean;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/activity');
      if (response.ok) {
        const result = await response.json();
        const actArray = result.data?.activities || result.activities || (Array.isArray(result) ? result : []);
        setActivities(Array.isArray(actArray) ? actArray : []);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (activityId: string) => {
    try {
      await fetch(`/api/activity/${activityId}/read`, {
        method: 'POST',
      });

      setActivities((prev) =>
        prev.map((a) =>
          (a.activity_log_id || a.id) === activityId ? { ...a, is_read: true } : a
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="pb-20 min-h-screen">
      <Header title="Activity" />

      <div className="p-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No activity yet"
            description="Activities from all your groups will appear here"
          />
        ) : (
          activities.map((activity) => (
            <Link
              key={activity.activity_log_id || activity.id || activity.timestamp}
              href={
                (activity.expense_id || activity.related_expense_id)
                  ? `/groups/${activity.group_id}/expenses/${activity.expense_id || activity.related_expense_id}`
                  : `/groups/${activity.group_id}`
              }
              onClick={() => !activity.is_read && markAsRead(activity.activity_log_id || activity.id || '')}
            >
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${
                !activity.is_read ? 'bg-[#E3F2FD]' : ''
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-[#5F6368] font-500">
                      {activity.group_name}
                    </p>
                    <p className="text-base text-[#1B1B1F] mt-1">
                      <span className="font-500">{activity.user_display_name || activity.user_name || 'Someone'}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-sm text-[#5F6368] mt-1">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#5F6368]">
                      {formatTime(activity.timestamp)}
                    </p>
                    {!activity.is_read && (
                      <div className="w-2 h-2 bg-[#1A73E8] rounded-full mt-2" />
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
