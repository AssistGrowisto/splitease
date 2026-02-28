'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useNotification } from '@/contexts/NotificationContext';

interface Member {
  email: string;
  display_name: string;
}

export default function CreateGroupPage() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [groupName, setGroupName] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [emailInput, setEmailInput] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_MEMBERS = 15;

  const handleAddMember = () => {
    if (!emailInput) {
      setError('Please enter an email');
      return;
    }

    if (members.length >= MAX_MEMBERS) {
      setError(`Maximum ${MAX_MEMBERS} members allowed`);
      return;
    }

    if (members.some(m => m.email === emailInput)) {
      setError('Member already added');
      return;
    }

    // For now, use email as display name (API will resolve actual display name)
    setMembers([...members, { email: emailInput, display_name: emailInput }]);
    setEmailInput('');
    setError('');
  };

  const handleRemoveMember = (email: string) => {
    setMembers(members.filter(m => m.email !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName.trim(),
          base_currency: baseCurrency,
          members: members.map(m => ({ email: m.email })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create group');
      }

      const data = await response.json();
      showNotification('Group created successfully', 'success');
      router.push(`/groups/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-20 min-h-screen">
      <Header
        title="Create Group"
        backButton={{ onClick: () => router.back() }}
      />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {error && (
          <div className="bg-[#F8D7DA] text-[#721C24] px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Group Name */}
        <Input
          label="Group Name"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value.slice(0, 50));
            setError('');
          }}
          placeholder="e.g., Trip to Europe"
          maxLength={50}
          required
        />
        <p className="text-xs text-[#5F6368]">{groupName.length}/50</p>

        {/* Currency */}
        <div>
          <label className="block text-sm font-500 text-[#1B1B1F] mb-3">Base Currency</label>
          <div className="space-y-2">
            {['INR', 'USD'].map((currency) => (
              <label key={currency} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="currency"
                  value={currency}
                  checked={baseCurrency === currency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className="w-4 h-4 accent-[#1A73E8]"
                />
                <span className="text-[#1B1B1F] font-500">{currency}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Add Members */}
        <div>
          <label className="block text-sm font-500 text-[#1B1B1F] mb-2">Add Members</label>
          <div className="flex gap-2">
            <Input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="member@example.com"
            />
            <Button
              type="button"
              onClick={handleAddMember}
              disabled={members.length >= MAX_MEMBERS}
              size="md"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-[#5F6368] mt-2">
            {members.length}/{MAX_MEMBERS} members
          </p>
        </div>

        {/* Members List */}
        {members.length > 0 && (
          <div className="bg-white rounded-lg p-4 space-y-2">
            {members.map((member) => (
              <div key={member.email} className="flex items-center justify-between">
                <div>
                  <p className="font-500 text-[#1B1B1F]">{member.display_name}</p>
                  <p className="text-xs text-[#5F6368]">{member.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.email)}
                  className="text-[#EA4335] hover:text-[#C5221F] font-600 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          disabled={!groupName.trim() || isLoading}
          isLoading={isLoading}
        >
          Create Group
        </Button>
      </form>
    </div>
  );
}
