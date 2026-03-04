import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'featured', label: 'FEATURED' },
  { value: 'newest', label: 'NEWEST' },
  { value: 'price-asc', label: 'PRICE: LOW TO HIGH' },
  { value: 'price-desc', label: 'PRICE: HIGH TO LOW' },
];

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || 'FEATURED';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 border-2 border-ua-grey text-ua-dark font-bold text-uppercase text-sm hover:border-ua-dark transition-colors"
      >
        {currentLabel}
        <svg
          className={clsx(
            'w-4 h-4 transition-transform',
            isOpen ? 'rotate-180' : '',
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-ua-light border-2 border-ua-dark shadow-lg z-10 min-w-64">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className={clsx(
                'w-full text-left px-4 py-3 text-sm font-bold text-uppercase border-b border-ua-grey last:border-0 transition-colors',
                currentSort === option.value
                  ? 'bg-ua-dark text-ua-light'
                  : 'text-ua-dark hover:bg-gray-50',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
