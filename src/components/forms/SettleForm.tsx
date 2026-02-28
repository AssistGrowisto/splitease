'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SimplifiedDebt {
  id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  currency: string;
  from_user_name: string;
  to_user_name: string;
}

interface SettleFormProps {
  debts: SimplifiedDebt[];
  currentUserId: string;
  onSubmit: (debtId: string, amount: number) => Promise<void>;
}

export function SettleForm({
  debts,
  currentUserId,
  onSubmit,
}: SettleFormProps) {
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter debts relevant to current user
  const relevantDebts = debts.filter(
    (debt) => debt.from_user_id === currentUserId || debt.to_user_id === currentUserId
  );

  const selectedDebt = relevantDebts.find((d) => d.id === selectedDebtId);
  const suggestedAmount = selectedDebt?.amount || 0;
  const settleAmount = customAmount ? parseFloat(customAmount) : suggestedAmount;

  const isValid = selectedDebtId && settleAmount > 0 && settleAmount <= suggestedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!selectedDebtId) newErrors.debt = 'Select a payment';
    if (!settleAmount || settleAmount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (settleAmount > suggestedAmount) {
      newErrors.amount = `Cannot exceed ${suggestedAmount.toFixed(2)}`;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsLoading(true);
      await onSubmit(selectedDebtId, settleAmount);
      setSelectedDebtId('');
      setCustomAmount('');
    } finally {
      setIsLoading(false);
    }
  };

  if (relevantDebts.length === 0) {
    return (
      <Card>
        <p className="text-center text-[#5F6368]">No pending payments</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Debt Selection */}
      <div>
        <label className="block text-sm font-500 text-[#1B1B1F] mb-2">Select Payment</label>
        <select
          value={selectedDebtId}
          onChange={(e) => {
            setSelectedDebtId(e.target.value);
            setCustomAmount('');
            setErrors((prev) => ({ ...prev, debt: '', amount: '' }));
          }}
          className="w-full px-4 py-3 text-base border border-[#DADCE0] rounded-lg focus:border-[#1A73E8] focus-ring transition-colors bg-white text-[#1B1B1F]"
        >
          <option value="">Choose who to pay...</option>
          {relevantDebts.map((debt) => {
            const isOwing = debt.from_user_id === currentUserId;
            return (
              <option key={debt.id} value={debt.id}>
                {isOwing
                  ? `Pay ${debt.to_user_name} ${debt.amount.toFixed(2)} ${debt.currency}`
                  : `Receive from ${debt.from_user_name} ${debt.amount.toFixed(2)} ${debt.currency}`}
              </option>
            );
          })}
        </select>
        {errors.debt && <p className="text-sm text-[#EA4335] mt-1">{errors.debt}</p>}
      </div>

      {/* Amount */}
      {selectedDebt && (
        <Card className="bg-[#F8F9FA]">
          <p className="text-sm text-[#5F6368] mb-2">Suggested Amount</p>
          <p className="text-2xl font-600 text-[#1B1B1F]">
            {suggestedAmount.toFixed(2)} {selectedDebt.currency}
          </p>
        </Card>
      )}

      <div>
        <Input
          label="Amount to Pay"
          type="number"
          step="0.01"
          min="0"
          max={suggestedAmount}
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setErrors((prev) => ({ ...prev, amount: '' }));
          }}
          placeholder={suggestedAmount.toFixed(2)}
          helperText={`Leave blank to pay full suggested amount`}
          error={errors.amount}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        disabled={!isValid || isLoading}
        isLoading={isLoading}
      >
        Record Payment
      </Button>
    </form>
  );
}
