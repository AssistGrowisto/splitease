import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A73E8] mb-1">SplitEase</h1>
          <p className="text-[#5F6368]">Expense splitting made simple</p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg card-shadow p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
