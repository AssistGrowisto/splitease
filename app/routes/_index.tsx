import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { HeroBanner } from '~/components/home/HeroBanner';
import { ShopByGender } from '~/components/home/ShopByGender';
import { FeaturedCollection } from '~/components/home/FeaturedCollection';
import { CategoryGrid } from '~/components/home/CategoryGrid';
import { PromoBanner } from '~/components/home/PromoBanner';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  // Mock data for demo purposes
  const mockProducts = Array.from({ length: 8 }).map((_, i) => ({
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
        amount: `${5000 + i * 1000}`,
      },
    },
  }));

  const categories = [
    {
      name: 'RUNNING',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      url: '/collections/running',
    },
    {
      name: 'TRAINING',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
      url: '/collections/training',
    },
    {
      name: 'BASKETBALL',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
      url: '/collections/basketball',
    },
    {
      name: 'GOLF',
      image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500&q=80',
      url: '/collections/golf',
    },
  ];

  return json({
    products: mockProducts,
    categories,
  });
};

export default function Index() {
  const { products, categories } = {
    products: Array.from({ length: 8 }).map((_, i) => ({
      id: `product-${i}`,
      title: `Premium Athletic Wear ${i + 1}`,
      handle: `product-${i}`,
      images: [
        {
          url: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80`,
          altText: `Product ${i + 1}`,
        },
      ],
      priceRange: {
        minVariantPrice: {
          amount: `${5000 + i * 1000}`,
        },
      },
    })),
    categories: [
      {
        name: 'RUNNING',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        url: '/collections/running',
      },
      {
        name: 'TRAINING',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
        url: '/collections/training',
      },
      {
        name: 'BASKETBALL',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
        url: '/collections/basketball',
      },
      {
        name: 'GOLF',
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500&q=80',
        url: '/collections/golf',
      },
    ],
  };

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner
        image="https://images.unsplash.com/photo-1552668751-c0d2d7d95bf0?w=1200&q=80"
        heading="EMPOWER YOUR PERFORMANCE"
        subheading="Premium athletic wear engineered for champions"
        ctaText="SHOP NOW"
        ctaUrl="/collections/new"
      />

      {/* Shop By Gender */}
      <ShopByGender />

      {/* New Arrivals */}
      <FeaturedCollection
        title="NEW ARRIVALS"
        collectionUrl="/collections/new"
        products={products}
      />

      {/* Category Grid */}
      <CategoryGrid categories={categories} />

      {/* Best Sellers */}
      <FeaturedCollection
        title="BEST SELLERS"
        collectionUrl="/collections/best-sellers"
        products={products.slice(0, 4)}
      />

      {/* Promo Banner */}
      <PromoBanner
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80"
        title="EXCLUSIVE COLLECTION"
        description="Limited edition performance gear for serious athletes"
        ctaText="DISCOVER MORE"
        ctaUrl="/collections/exclusive"
      />

      {/* Featured Collection */}
      <FeaturedCollection
        title="TRENDING NOW"
        collectionUrl="/collections/trending"
        products={products.slice(4, 8)}
      />
    </div>
  );
}
