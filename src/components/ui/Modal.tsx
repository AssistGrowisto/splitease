'use client';

import React, { useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  confirmVariant?: 'primary' | 'danger' | 'success';
  showConfirmButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isConfirming?: boolean;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  confirmVariant = 'primary',
  showConfirmButton = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  isConfirming = false,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#DADCE0] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-600 text-[#1B1B1F]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#5F6368] hover:text-[#1B1B1F] transition-colors text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {showConfirmButton && (
          <div className="border-t border-[#DADCE0] px-6 py-4 flex gap-3 justify-end">
            <Button variant="secondary" onClick={onClose} disabled={isConfirming}>
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              isLoading={isConfirming}
            >
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
