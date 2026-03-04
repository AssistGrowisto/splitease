import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import clsx from 'clsx';
import { Button } from './Button';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Search Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-50 flex flex-col bg-ua-light transform transition-opacity duration-300',
          {
            'opacity-100 pointer-events-auto': isOpen,
            'opacity-0 pointer-events-none': !isOpen,
          },
        )}
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-ua-grey">
          <h2 className="text-2xl font-bold text-uppercase">SEARCH</h2>
          <button
            onClick={onClose}
            className="text-ua-dark hover:text-ua-grey transition-colors"
            aria-label="Close search"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            <form onSubmit={handleSearch} className="mb-8">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-ua-dark focus:outline-none focus:border-ua-dark"
              />
            </form>

            {!query && (
              <div className="text-center py-12">
                <p className="text-ua-grey text-lg">
                  Start typing to search for products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
