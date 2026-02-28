'use client';

import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-500 rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed focus-ring';

  const variantStyles = {
    primary: 'bg-[#1A73E8] text-white hover:bg-[#1557B0]',
    secondary: 'bg-white text-[#1A73E8] border border-[#DADCE0] hover:bg-[#F8F9FA]',
    danger: 'bg-[#EA4335] text-white hover:bg-[#C5221F]',
    success: 'bg-[#34A853] text-white hover:bg-[#2D6A4F]',
  };

  const sizeStyles = {
    sm: 'text-sm px-3 min-h-[36px]',
    md: 'text-base px-4 min-h-[44px]',
    lg: 'text-lg px-6 min-h-[48px]',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
