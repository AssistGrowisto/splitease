'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

interface ExpenseDetail {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  creator_id: string;
  is_orphaned: boolean;
  paid_by: Array<{
    user_id: string;
    display_name: string;
    amount: number;
  }>;
  splits: Array<{
    member_id: string;
    display_name: string;
    amount: number;
  }>;
  activity_log: Array<{
    id: string;
    user: string;
    action: string;
    description: string;
    timestamp: string;
  }>;
  receipt_url?: string;
}

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const expenseId = params.expId as string;
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [expense, setExpense] = useState<ExpenseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);

  useEffect(() => {
    fetchExpense();
  }, [groupId, expenseId]);

  const fetchExpense = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}/expenses/${expenseId}`);
      if (response.ok) {
        const data = await response.json();
        setExpense(data);
      }
    } catch (error) {
      console.error('Failed to fetch expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/groups/${groupId}/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showNotification('Expense deleted', 'success');
        router.push(`/groups/${groupId}`);
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;

    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!expense) {
    return <div>Expense not found</div>;
  }

  const canEdit = user?.id === expense.creator_id && !expense.is_orphaned;
  const canDelete = user?.id === expense.creator_id;

  return (
    <div className="pb-20 min-h-screen">
      <Header
        title="Expense Details"
        backButton={{ onClick: () => router.back() }}
      />

      <div className="p-4 space-y-4">
        {/* Description and Amount */}
        <Card>
          <h2 className="text-2xl font-600 text-[#1B1B1F]">{expense.description}</h2>
          <p className="text-4xl font-bold text-[#1A73E8] mt-2">
            {expense.amount.toFixed(2)} <span className="text-xl text-[#5F6368]">{expense.currency}</span>
          </p>
          <p className="text-sm text-[#5F6368] mt-2">{formatDate(expense.date)}</p>
        </Card>

        {/* Paid By */}
        <Card>
          <h3 className="font-600 text-[#1B1B1F] mb-3">Paid By</h3>
          <div className="space-y-2">
            {expense.paid_by.map((payer) => (
              <div key={payer.user_id} className="flex items-center justify-between">
                <p className="text-[#1B1B1F]">{payer.display_name}</p>
                <p className="font-500">{payer.amount.toFixed(2)} {expense.currency}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Split Between */}
        <Card>
          <h3 className="font-600 text-[#1B1B1F] mb-3">Split Between</h3>
          <div className="space-y-2">
            {expense.splits.map((split) => (
              <div key={split.member_id} className="flex items-center justify-between">
                <p className="text-[#1B1B1F]">{split.display_name}</p>
                <p className="font-500">{split.amount.toFixed(2)} {expense.currency}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Receipt */}
        {expense.receipt_url && (
          <Card>
            <h3 className="font-600 text-[#1B1B1F] mb-2">Receipt</h3>
            <button
              onClick={() => setReceiptModal(true)}
              className="w-full bg-[#F8F9FA] rounded-lg overflow-hidden hover:bg-[#DADCE0] transition-colors"
            >
              <img
                src={expense.receipt_url}
                alt="Receipt"
                className="w-full max-h-48 object-cover"
              />
            </button>
          </Card>
        )}

        {/* Activity Log */}
        {expense.activity_log && expense.activity_log.length > 0 && (
          <Card>
            <h3 className="font-600 text-[#1B1B1F] mb-3">Activity</h3>
            <div className="space-y-2">
              {expense.activity_log.map((activity) => (
                <div key={activity.id} className="text-sm">
                  <p className="text-[#1B1B1F]">
                    <span className="font-500">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-[#5F6368]">{activity.description}</p>
                  <p className="text-xs text-[#5F6368] mt-1">{formatTime(activity.timestamp)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {canEdit && (
            <Link href={`/groups/${groupId}/expenses/${expenseId}/edit`} className="flex-1">
              <Button fullWidth>Edit</Button>
            </Link>
          )}
          {canDelete && (
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              fullWidth={!canEdit}
              className={canEdit ? 'flex-1' : ''}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        title="Delete Expense?"
        onClose={() => setShowDeleteModal(false)}
        showConfirmButton
        confirmVariant="danger"
        confirmText="Delete"
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      >
        <p className="text-[#5F6368]">
          This action cannot be undone. The expense will be permanently deleted from the group.
        </p>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={receiptModal}
        title="Receipt"
        onClose={() => setReceiptModal(false)}
      >
        {expense.receipt_url && (
          <img src={expense.receipt_url} alt="Receipt" className="w-full" />
        )}
      </Modal>
    </div>
  );
}
