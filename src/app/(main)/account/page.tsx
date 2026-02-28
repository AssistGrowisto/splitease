'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, updateDisplayName, changePassword } = useAuth();
  const { showNotification } = useNotification();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    try {
      setIsSavingName(true);
      setError('');
      await updateDisplayName(displayName.trim());
      showNotification('Display name updated', 'success');
      setIsEditingName(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update name');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(currentPassword, newPassword, confirmNewPassword);
      showNotification('Password changed successfully', 'success');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Logged out successfully', 'success');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  };

  return (
    <div className="pb-20 min-h-screen">
      <Header title="Account" />

      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-[#F8D7DA] text-[#721C24] px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Display Name */}
        <Card>
          <h3 className="font-600 text-[#1B1B1F] mb-3">Display Name</h3>
          {isEditingName ? (
            <div className="flex gap-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Button
                onClick={handleSaveName}
                disabled={displayName === user?.display_name || isSavingName}
                size="md"
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setDisplayName(user?.display_name || '');
                  setIsEditingName(false);
                }}
                size="md"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-lg text-[#1B1B1F] font-500">{displayName}</p>
              <Button
                variant="secondary"
                onClick={() => setIsEditingName(true)}
                size="sm"
              >
                Edit
              </Button>
            </div>
          )}
        </Card>

        {/* Email */}
        <Card>
          <h3 className="font-600 text-[#1B1B1F] mb-2">Email</h3>
          <p className="text-[#1B1B1F]">{user?.email}</p>
          <p className="text-xs text-[#5F6368] mt-1">Your email cannot be changed</p>
        </Card>

        {/* Change Password */}
        <Card>
          <h3 className="font-600 text-[#1B1B1F] mb-3 cursor-pointer flex items-center justify-between"
            onClick={() => setShowPasswordForm(!showPasswordForm)}>
            Change Password
            <svg
              className={`w-5 h-5 text-[#5F6368] transition-transform ${
                showPasswordForm ? 'rotate-180' : ''
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </h3>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-3">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                showPasswordToggle
                required
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                showPasswordToggle
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                showPasswordToggle
                required
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!currentPassword || !newPassword || !confirmNewPassword || isChangingPassword}
                  isLoading={isChangingPassword}
                  className="flex-1"
                >
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Summary */}
        <Card className="bg-[#F8F9FA]">
          <h3 className="font-600 text-[#1B1B1F] mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-[#5F6368]">Total you owe</p>
              <p className="font-500 text-[#EA4335]">TBD</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#5F6368]">Total you're owed</p>
              <p className="font-500 text-[#34A853]">TBD</p>
            </div>
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="danger"
          fullWidth
          onClick={handleLogout}
        >
          Log Out
        </Button>

        {/* Version */}
        <div className="text-center pt-4">
          <p className="text-xs text-[#5F6368]">SplitEase v1.0</p>
        </div>
      </div>
    </div>
  );
}
