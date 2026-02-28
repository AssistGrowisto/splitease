'use client';

import React from 'react';

interface AvatarProps {
  displayName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ displayName, size = 'md', className = '' }: AvatarProps) {
  // Get initials from display name
  const initials = displayName
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  // Generate a color based on the name hash
  const hashCode = displayName.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  const colors = [
    'bg-[#1A73E8]',
    'bg-[#34A853]',
    'bg-[#EA4335]',
    'bg-[#FBBC04]',
    'bg-[#FF6D00]',
    'bg-[#9C27B0]',
    'bg-[#00BCD4]',
    'bg-[#673AB7]',
  ];

  const color = colors[Math.abs(hashCode) % colors.length];

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${color} text-white rounded-full flex items-center justify-center font-600 ${sizeStyles[size]} ${className}`}
      title={displayName}
    >
      {initials || '?'}
    </div>
  );
}
