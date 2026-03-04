import { Breadcrumb } from '../ui/Breadcrumb';
import { SortDropdown, type SortOption } from './SortDropdown';

interface CollectionHeaderProps {
  title: string;
  productCount: number;
  description?: string;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
}

export function CollectionHeader({
  title,
  productCount,
  description,
  currentSort,
  onSortChange,
  onFilterClick,
  showFilterButton = false,
}: CollectionHeaderProps) {
  return (
    <div className="bg-ua-light border-b border-ua-grey">
      {/* Breadcrumb */}
      <div className="container-padding pt-6">
        <Breadcrumb
          items={[
            { label: 'HOME', href: '/' },
            { label: title.toUpperCase() },
          ]}
        />
      </div>

      {/* Title & Description */}
      <div className="container-padding py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-uppercase mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-ua-grey max-w-2xl mb-4">{description}</p>
        )}
      </div>

      {/* Controls Bar */}
      <div className="container-padding pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm text-ua-grey">
          {productCount} PRODUCTS
        </p>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {showFilterButton && (
            <button
              onClick={onFilterClick}
              className="md:hidden flex items-center gap-2 px-4 py-3 border-2 border-ua-dark text-ua-dark font-bold text-uppercase text-sm hover:bg-ua-dark hover:text-ua-light transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              FILTER
            </button>
          )}

          <SortDropdown currentSort={currentSort} onSortChange={onSortChange} />
        </div>
      </div>
    </div>
  );
}
