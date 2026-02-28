'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

interface Member {
  id: string;
  display_name: string;
  email: string;
  is_creator: boolean;
  net_balance: number;
}

interface Group {
  id: string;
  name: string;
  base_currency: string;
  creator_id: string;
  members: Member[];
}

export default function GroupSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [group, setGroup] = useState<Group | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/groups/${groupId}`);
      if (response.ok) {
        const data = await response.json();
        setGroup(data);
        setEditingName(data.name);
      }
    } catch (err) {
      console.error('Failed to fetch group:', err);
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

  const isCreator = user?.user_id === group.creator_id;

  const handleSaveName = async () => {
    if (!editingName.trim()) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() }),
      });

      if (response.ok) {
        setGroup({ ...group, name: editingName.trim() });
        showNotification('Group name updated', 'success');
      }
    } catch (err) {
      setError('Failed to update group name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setError('Enter an email address');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newMemberEmail.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setGroup(data);
        setNewMemberEmail('');
        showNotification('Member added', 'success');
      } else {
        const err = await response.json();
        setError(err.message);
      }
    } catch (err) {
      setError('Failed to add member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setGroup(data);
        showNotification('Member removed', 'success');
      }
    } catch (err) {
      setError('Failed to remove member');
    }
  };

  const handleArchive = async () => {
    try {
      setIsArchiving(true);
      const response = await fetch(`/api/groups/${groupId}/archive`, {
        method: 'POST',
      });

      if (response.ok) {
        showNotification('Group archived', 'success');
        router.push('/groups');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to archive group');
    } finally {
      setIsArchiving(false);
      setShowArchiveModal(false);
    }
  };

  const allSettled = group.members.every(m => Math.abs(m.net_balance) < 0.01);

  return (
    <div className="pb-20 min-h-screen">
      <Header
        title="Group Settings"
        backButton={{ onClick: () => router.back() }}
      />

      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-[#F8D7DA] text-[#721C24] px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Group Name */}
        {isCreator && (
          <Card>
            <h3 className="font-600 text-[#1B1B1F] mb-3">Group Name</h3>
            <div className="flex gap-2">
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value.slice(0, 50))}
                maxLength={50}
              />
              <Button
                type="button"
                onClick={handleSaveName}
                disabled={editingName === group.name || isSaving}
                size="md"
              >
                Save
              </Button>
            </div>
          </Card>
        )}

        {/* Base Currency */}
        <Card>
          <h3 className="font-600 text-[#1B1B1F] mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#5F6368]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 11-2 0V8H7v1a1 1 0 11-2 0zm0 4v2a1 1 0 001 1h8a1 1 0 001-1v-2a1 1 0 11-2 0v1H7v-1a1 1 0 11-2 0z"
                clipRule="evenodd"
              />
            </svg>
            Base Currency
          </h3>
          <p className="text-lg font-600 text-[#1B1B1F]">{group.base_currency}</p>
          <p className="text-xs text-[#5F6368] mt-1">Cannot be changed</p>
        </Card>

        {/* Members */}
        <Card>
          <h3 className="font-600 text-[#1B1B1F] mb-4">Members ({group.members.length})</h3>
          <div className="space-y-3">
            {group.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar displayName={member.display_name} size="md" />
                  <div>
                    <p className="font-500 text-[#1B1B1F]">{member.display_name}</p>
                    <p className="text-xs text-[#5F6368]">{member.email}</p>
                  </div>
                </div>
                {isCreator && !member.is_creator && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={member.net_balance !== 0}
                    title={member.net_balance !== 0 ? 'Cannot remove member with pending balance' : ''}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Add Member */}
        {isCreator && (
          <Card>
            <h3 className="font-600 text-[#1B1B1F] mb-3">Add Member</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="email@example.com"
              />
              <Button
                type="button"
                onClick={handleAddMember}
                disabled={!newMemberEmail || isSaving}
                size="md"
              >
                Add
              </Button>
            </div>
          </Card>
        )}

        {/* Archive Group */}
        {isCreator && (
          <Card>
            <h3 className="font-600 text-[#1B1B1F] mb-2">Danger Zone</h3>
            <p className="text-sm text-[#5F6368] mb-4">
              Archiving a group cannot be undone. All members must have zero balance.
            </p>
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowArchiveModal(true)}
              disabled={!allSettled}
              fullWidth
            >
              Archive Group
            </Button>
          </Card>
        )}
      </div>

      {/* Archive Modal */}
      <Modal
        isOpen={showArchiveModal}
        title="Archive Group?"
        onClose={() => setShowArchiveModal(false)}
        showConfirmButton
        confirmVariant="danger"
        confirmText="Archive"
        onConfirm={handleArchive}
        isConfirming={isArchiving}
      >
        <p className="text-[#5F6368]">
          This action cannot be undone. The group will be moved to "Past Groups" and hidden from your active list.
        </p>
      </Modal>
    </div>
  );
}
