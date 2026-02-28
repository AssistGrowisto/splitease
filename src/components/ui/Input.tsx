'use client';

import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  required = false,
  type = 'text',
  showPasswordToggle = false,
  className = '',
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random()}`;
  const isPassword = type === 'password' && showPasswordToggle;
  const displayType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-500 text-[#1B1B1F] mb-2">
          {label}
          {required && <span className="text-[#EA4335] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={displayType}
          className={`w-full px-4 py-3 text-base border border-[#DADCE0] rounded-lg focus:border-[#1A73E8] focus-ring transition-colors bg-white text-[#1B1B1F] placeholder-[#5F6368] ${
            error ? 'border-[#EA4335] focus:border-[#EA4335]' : ''
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6368] hover:text-[#1B1B1F] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clipRule="evenodd"
                />
                <path d="M15.171 13.576l1.473 1.473A10.014 10.014 0 0019.542 10c-1.274-4.057-5.064-7-9.542-7a9.958 9.958 0 00-4.512 1.074l1.473 1.473C9.018 5.539 9.5 5.5 10 5.5a4 4 0 014 4c0 .498-.059.98-.16 1.449z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-[#EA4335] mt-1">{error}</p>}
      {helperText && !error && <p className="text-sm text-[#5F6368] mt-1">{helperText}</p>}
    </div>
  );
}
