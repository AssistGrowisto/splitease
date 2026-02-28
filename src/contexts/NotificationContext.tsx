'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const showNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
      const id = `${Date.now()}-${Math.random()}`;
      const notification: Notification = { id, message, type };

      setNotifications((prev) => [...prev, notification]);

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        removeNotification(id);
      }, 5000);

      return () => clearTimeout(timer);
    },
    [removeNotification]
  );

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-[calc(100%-2rem)] pointer-events-none">
        {notifications.map((notif) => (
          <Toast key={notif.id} notification={notif} onClose={() => removeNotification(notif.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function Toast({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const bgColor =
    notification.type === 'success'
      ? 'bg-[#34A853]'
      : notification.type === 'error'
        ? 'bg-[#EA4335]'
        : notification.type === 'warning'
          ? 'bg-[#FBBC04]'
          : 'bg-[#1A73E8]';

  const textColor = notification.type === 'warning' ? 'text-[#1B1B1F]' : 'text-white';

  return (
    <div
      className={`${bgColor} ${textColor} rounded-lg px-4 py-3 shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-right-2 duration-300 pointer-events-auto min-h-[44px]`}
    >
      <span className="text-sm font-500">{notification.message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-lg leading-none opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
