import { useState } from 'react';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { CollectionHeader } from '~/components/collection/CollectionHeader';
import { FilterSidebar } from '~/components/collection/FilterSidebar';
import { ProductGrid } from '~/components/product/ProductGrid';
import type { SortOption } from '~/components/collection/SortDropdown';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { handle } = params;

  if (!handle) {
    throw new Response('Collection not found', { status: 404 });
  }

  // Mock collection data
  const mockProducts = Array.from({ length: 24 }).map((_, i) => ({
    id: `product-${i}`,
    title: `Product ${i + 1}`,
    handle: `product-${i}`,
    images: [
      {
        url: `https://images.unsplash.com/photo-${1550000000000 + i}?w=500&q=80`,
        altText: `Product ${i + 1}`,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: `${5000 + Math.random() * 20000}`,
      },
    },
  }));

  return json({
    collection: {
      title: handle.charAt(0).toUpperCase() + handle.slice(1),
      handle,
      description: `Explore our ${handle} collection`,
    },
    products: mockProducts,
    productCount: mockProducts.length,
  });
};

const FILTER_GROUPS = [
  {
    title: 'GENDER',
    key: 'gender',
    options: [
      { id: 'men', label: 'Men', count: 120 },
      { id: 'women', label: 'Women', count: 95 },
      { id: 'kids', label: 'Kids', count: 45 },
    ],
  },
  {
    title: 'CATEGORY',
    key: 'category',
    options: [
      { id: 'tops', label: 'Tops', count: 80 },
      { id: 'bottoms', label: 'Bottoms', count: 65 },
      { id: 'shoes', label: 'Shoes', count: 55 },
      { id: 'accessories', label: 'Accessories', count: 40 },
    ],
  },
  {
    title: 'SPORT',
    key: 'sport',
    options: [
      { id: 'running', label: 'Running', count: 90 },
      { id: 'training', label: 'Training', count: 75 },
      { id: 'basketball', label: 'Basketball', count: 50 },
      { id: 'golf', label: 'Golf', count: 30 },
    ],
  },
];

export default function CollectionPage() {
  const { collection, products, productCount } = useLoaderData<typeof loader>();
  const [currentSort, setCurrentSort] = useState<SortOption>('featured');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (group: string, value: string, isChecked: boolean) => {
    setSelectedFilters((prev) => {
      const groupFilters = prev[group] || [];
      if (isChecked) {
        return {
          ...prev,
          [group]: [...groupFilters, value],
        };
      } else {
        return {
          ...prev,
          [group]: groupFilters.filter((f) => f !== value),
        };
      }
    });
  };

  return (
    <div>
      <CollectionHeader
        title={collection.title}
        description={collection.description}
        productCount={productCount}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
        showFilterButton={true}
      />

      <div className="flex gap-6 container-padding section-spacing">
        {/* Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={FILTER_GROUPS}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            priceRange={{ min: 2500, max: 25000 }}
          />
        </div>

        {/* Products */}
        <div className="flex-grow">
          <ProductGrid products={products} />

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-12 pt-12 border-t border-ua-grey">
            <button
              disabled
              className="px-6 py-3 border-2 border-ua-grey text-ua-grey disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PREVIOUS
            </button>
            <div className="text-sm text-ua-grey">
              Page 1 of 3
            </div>
            <button className="px-6 py-3 border-2 border-ua-dark text-ua-dark hover:bg-ua-dark hover:text-ua-light transition-colors font-bold">
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
