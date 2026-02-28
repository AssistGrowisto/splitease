'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'red' | 'gray' | 'blue';
  children: React.ReactNode;
}

export function Badge({ variant = 'gray', children, className = '', ...props }: BadgeProps) {
  const variantStyles = {
    green: 'bg-[#D4EDDA] text-[#155724]',
    red: 'bg-[#F8D7DA] text-[#721C24]',
    gray: 'bg-[#E9ECEF] text-[#383D41]',
    blue: 'bg-[#D1ECF1] text-[#0C5460]',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-500 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
