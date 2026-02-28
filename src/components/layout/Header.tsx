'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  backButton?: {
    onClick: () => void;
    label?: string;
  };
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  backButton,
  rightAction,
  className = '',
}: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-10 bg-white border-b border-[#DADCE0] h-14 flex items-center px-4 gap-3 ${className}`}
    >
      {backButton && (
        <button
          onClick={backButton.onClick}
          className="text-[#1A73E8] hover:text-[#1557B0] transition-colors flex items-center gap-1 min-h-[44px] min-w-[44px] -ml-2 justify-center"
          aria-label={backButton.label || 'Go back'}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <h1 className="text-lg font-600 text-[#1B1B1F] flex-1">{title}</h1>
      {rightAction && <div className="flex items-center">{rightAction}</div>}
    </header>
  );
}
