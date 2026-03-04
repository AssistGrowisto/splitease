import { Link } from '@remix-run/react';
import { ProductCard } from '../product/ProductCard';
import { Button } from '../ui/Button';

interface Product {
  id: string;
  title: string;
  handle: string;
  images?: Array<{ url: string; altText?: string }>;
  priceRange?: {
    minVariantPrice?: { amount: string };
  };
}

interface FeaturedCollectionProps {
  title: string;
  collectionUrl?: string;
  products: Product[];
  showViewAll?: boolean;
}

export function FeaturedCollection({
  title,
  collectionUrl = '/collections/all',
  products,
  showViewAll = true,
}: FeaturedCollectionProps) {
  return (
    <section className="section-spacing">
      <div className="container-padding">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ua-dark text-uppercase">
            {title}
          </h2>
          {showViewAll && collectionUrl && (
            <Link to={collectionUrl}>
              <Button variant="outline" size="md">
                VIEW ALL
              </Button>
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              handle={product.handle}
              image={product.images?.[0]}
              price={product.priceRange?.minVariantPrice?.amount || '0'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
