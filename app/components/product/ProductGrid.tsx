import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  title: string;
  handle: string;
  images?: Array<{ url: string; altText?: string }>;
  priceRange?: {
    minVariantPrice?: { amount: string };
  };
  compareAtPrice?: string;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-ua-grey text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          handle={product.handle}
          image={product.images?.[0]}
          price={product.priceRange?.minVariantPrice?.amount || '0'}
          compareAtPrice={product.compareAtPrice}
        />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}
