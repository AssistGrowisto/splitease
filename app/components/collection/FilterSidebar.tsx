import { useState } from 'react';
import clsx from 'clsx';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  title: string;
  key: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (group: string, value: string, isChecked: boolean) => void;
  priceRange?: { min: number; max: number };
  onPriceChange?: (min: number, max: number) => void;
}

export function FilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  priceRange,
  onPriceChange,
}: FilterSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    filters.reduce((acc, f) => ({ ...acc, [f.key]: true }), {}),
  );

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <aside className="bg-ua-light border-r border-ua-grey p-6 h-fit sticky top-20">
      <h3 className="text-lg font-bold text-uppercase mb-6 tracking-widest">
        FILTERS
      </h3>

      {/* Price Range */}
      {priceRange && (
        <div className="mb-6 pb-6 border-b border-ua-grey">
          <button
            onClick={() => toggleGroup('price')}
            className="w-full flex items-center justify-between font-bold text-uppercase text-sm tracking-widest mb-3"
          >
            PRICE
            <svg
              className={clsx(
                'w-4 h-4 transition-transform',
                expandedGroups.price ? 'rotate-180' : '',
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

          {expandedGroups.price && (
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                defaultValue={priceRange.min}
                onChange={(e) =>
                  onPriceChange?.(parseFloat(e.target.value), priceRange.max)
                }
                className="w-full"
              />
              <p className="text-sm text-ua-grey">
                ₹{priceRange.min.toLocaleString('en-IN')} - ₹
                {priceRange.max.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filter Groups */}
      {filters.map((group) => (
        <div key={group.key} className="mb-6 pb-6 border-b border-ua-grey last:border-0">
          <button
            onClick={() => toggleGroup(group.key)}
            className="w-full flex items-center justify-between font-bold text-uppercase text-sm tracking-widest mb-3"
          >
            {group.title}
            <svg
              className={clsx(
                'w-4 h-4 transition-transform',
                expandedGroups[group.key] ? 'rotate-180' : '',
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

          {expandedGroups[group.key] && (
            <div className="space-y-2">
              {group.options.map((option) => {
                const isChecked =
                  selectedFilters[group.key]?.includes(option.id) || false;

                return (
                  <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        onFilterChange(group.key, option.id, e.target.checked)
                      }
                      className="w-4 h-4 border-2 border-ua-grey"
                    />
                    <span className="text-sm text-ua-grey hover:text-ua-dark transition-colors">
                      {option.label}
                      {option.count && (
                        <span className="text-ua-grey ml-2">({option.count})</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          Object.keys(selectedFilters).forEach((key) => {
            selectedFilters[key].forEach((value) => {
              onFilterChange(key, value, false);
            });
          });
        }}
        className="w-full py-3 border-2 border-ua-dark text-ua-dark font-bold text-uppercase text-sm hover:bg-ua-dark hover:text-ua-light transition-colors"
      >
        CLEAR ALL
      </button>
    </aside>
  );
}
