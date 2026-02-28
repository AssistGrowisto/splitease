'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

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

interface ExpenseFormData {
  description: string;
  amount: number;
  currency: string;
  date: string;
  paid_by: string;
  split_type: 'equal' | 'custom' | 'percentage';
  splits: Record<string, { member_id: string; amount: number }>;
  receipt_url?: string;
}

interface ExpenseFormProps {
  groupMembers: GroupMember[];
  baseCurrency: string;
  currencies: Currency[];
  initialData?: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  isEdit?: boolean;
}

export function ExpenseForm({
  groupMembers,
  baseCurrency,
  currencies,
  initialData,
  onSubmit,
  isEdit = false,
}: ExpenseFormProps) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [currency, setCurrency] = useState(initialData?.currency || baseCurrency);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(initialData?.paid_by || groupMembers[0]?.id || '');
  const [splitType, setSplitType] = useState<'equal' | 'custom' | 'percentage'>(
    initialData?.split_type || 'equal'
  );
  const [selectedMembers, setSelectedMembers] = useState<Record<string, boolean>>(() => {
    if (initialData?.splits) {
      const selected: Record<string, boolean> = {};
      groupMembers.forEach((m) => {
        selected[m.id] = !!initialData.splits[m.id];
      });
      return selected;
    }
    return groupMembers.reduce(
      (acc, m) => {
        acc[m.id] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
  });
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(() => {
    if (initialData?.splits && splitType === 'custom') {
      const amounts: Record<string, string> = {};
      groupMembers.forEach((m) => {
        amounts[m.id] = initialData.splits[m.id]?.amount?.toString() || '';
      });
      return amounts;
    }
    return {};
  });
  const [percentages, setPercentages] = useState<Record<string, string>>(() => {
    if (initialData?.splits && splitType === 'percentage') {
      const pcts: Record<string, string> = {};
      groupMembers.forEach((m) => {
        pcts[m.id] = initialData.splits[m.id]?.amount?.toString() || '';
      });
      return pcts;
    }
    return {};
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCount = Object.values(selectedMembers).filter(Boolean).length;
  const numericAmount = parseFloat(amount) || 0;
  const remainingPercentage = 100 - Object.values(percentages).reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
  const remainingAmount = splitType === 'custom' 
    ? numericAmount - Object.values(customAmounts).reduce((sum, a) => sum + (parseFloat(a) || 0), 0)
    : 0;

  const isValid =
    description.trim().length > 0 &&
    numericAmount > 0 &&
    selectedCount > 0 &&
    paidBy &&
    (splitType === 'equal' ||
      (splitType === 'custom' && Math.abs(remainingAmount) < 0.01) ||
      (splitType === 'percentage' && Math.abs(remainingPercentage) < 0.01));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) newErrors.description = 'Description is required';
    if (numericAmount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (selectedCount === 0) newErrors.members = 'Select at least one member';
    if (!paidBy) newErrors.paidBy = 'Select who paid';

    if (splitType === 'custom' && Math.abs(remainingAmount) > 0.01) {
      newErrors.splits = `Remaining: ${remainingAmount.toFixed(2)} ${currency}`;
    }
    if (splitType === 'percentage' && Math.abs(remainingPercentage) > 0.01) {
      newErrors.splits = `Remaining: ${remainingPercentage.toFixed(1)}%`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const splits: Record<string, { member_id: string; amount: number }> = {};

      if (splitType === 'equal') {
        const perPerson = numericAmount / selectedCount;
        Object.entries(selectedMembers).forEach(([memberId, selected]) => {
          if (selected) {
            splits[memberId] = {
              member_id: memberId,
              amount: perPerson,
            };
          }
        });
      } else if (splitType === 'custom') {
        Object.entries(selectedMembers).forEach(([memberId, selected]) => {
          if (selected) {
            const customAmount = parseFloat(customAmounts[memberId] || '0');
            splits[memberId] = {
              member_id: memberId,
              amount: customAmount,
            };
          }
        });
      } else if (splitType === 'percentage') {
        Object.entries(selectedMembers).forEach(([memberId, selected]) => {
          if (selected) {
            const percentage = parseFloat(percentages[memberId] || '0');
            const amount = (numericAmount * percentage) / 100;
            splits[memberId] = {
              member_id: memberId,
              amount: parseFloat(amount.toFixed(2)),
            };
          }
        });
      }

      const formData: ExpenseFormData = {
        description: description.trim(),
        amount: numericAmount,
        currency,
        date,
        paid_by: paidBy,
        split_type: splitType,
        splits,
        receipt_url: initialData?.receipt_url,
      };

      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description */}
      <div>
        <Input
          label="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value.slice(0, 200));
            setErrors((prev) => ({ ...prev, description: '' }));
          }}
          placeholder="e.g., Dinner at restaurant"
          maxLength={200}
          error={errors.description}
          required
        />
        <p className="text-xs text-[#5F6368] mt-1">{description.length}/200</p>
      </div>

      {/* Amount and Currency */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors((prev) => ({ ...prev, amount: '' }));
            }}
            placeholder="0.00"
            error={errors.amount}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-500 text-[#1B1B1F] mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-3 text-base border border-[#DADCE0] rounded-lg focus:border-[#1A73E8] focus-ring transition-colors bg-white text-[#1B1B1F]"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Paid By */}
      <div>
        <label className="block text-sm font-500 text-[#1B1B1F] mb-2">Paid By</label>
        <select
          value={paidBy}
          onChange={(e) => {
            setPaidBy(e.target.value);
            setErrors((prev) => ({ ...prev, paidBy: '' }));
          }}
          className="w-full px-4 py-3 text-base border border-[#DADCE0] rounded-lg focus:border-[#1A73E8] focus-ring transition-colors bg-white text-[#1B1B1F]"
        >
          {groupMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.display_name}
            </option>
          ))}
        </select>
        {errors.paidBy && <p className="text-sm text-[#EA4335] mt-1">{errors.paidBy}</p>}
      </div>

      {/* Split Type Toggle */}
      <div>
        <label className="block text-sm font-500 text-[#1B1B1F] mb-3">Split Type</label>
        <div className="grid grid-cols-3 gap-2">
          {(['equal', 'custom', 'percentage'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSplitType(type)}
              className={`py-2 px-3 rounded-lg font-500 text-sm transition-all ${
                splitType === type
                  ? 'bg-[#1A73E8] text-white'
                  : 'bg-[#F8F9FA] text-[#1B1B1F] border border-[#DADCE0]'
              }`}
            >
              {type === 'equal' ? 'Equal' : type === 'custom' ? 'Custom' : 'Percentage'}
            </button>
          ))}
        </div>
      </div>

      {/* Split Between */}
      <Card>
        <h3 className="font-600 text-[#1B1B1F] mb-3">Split Between</h3>
        <div className="space-y-3">
          {groupMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`member-${member.id}`}
                checked={selectedMembers[member.id] || false}
                onChange={() => toggleMember(member.id)}
                className="w-5 h-5 accent-[#1A73E8] cursor-pointer"
              />
              <label
                htmlFor={`member-${member.id}`}
                className="flex-1 cursor-pointer text-[#1B1B1F] font-500"
              >
                {member.display_name}
              </label>

              {selectedMembers[member.id] && splitType === 'custom' && (
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={customAmounts[member.id] || ''}
                  onChange={(e) => {
                    setCustomAmounts((prev) => ({
                      ...prev,
                      [member.id]: e.target.value,
                    }));
                  }}
                  className="w-20 px-2 py-1 text-sm border border-[#DADCE0] rounded focus:border-[#1A73E8] focus-ring"
                  placeholder="0.00"
                />
              )}

              {selectedMembers[member.id] && splitType === 'percentage' && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={percentages[member.id] || ''}
                    onChange={(e) => {
                      setPercentages((prev) => ({
                        ...prev,
                        [member.id]: e.target.value,
                      }));
                    }}
                    className="w-16 px-2 py-1 text-sm border border-[#DADCE0] rounded focus:border-[#1A73E8] focus-ring"
                    placeholder="0"
                  />
                  <span className="text-sm text-[#5F6368]">%</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.members && <p className="text-sm text-[#EA4335] mt-3">{errors.members}</p>}
        {errors.splits && <p className="text-sm text-[#EA4335] mt-3">{errors.splits}</p>}
      </Card>

      {/* Receipt Upload */}
      <div>
        <label className="block text-sm font-500 text-[#1B1B1F] mb-2">Receipt (Optional)</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
          className="w-full"
        />
        {receiptFile && <p className="text-sm text-[#5F6368] mt-2">Selected: {receiptFile.name}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        disabled={!isValid || isLoading}
        isLoading={isLoading}
      >
        {isEdit ? 'Update Expense' : 'Add Expense'}
      </Button>
    </form>
  );
}
