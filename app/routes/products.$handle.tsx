import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { Breadcrumb } from '~/components/ui/Breadcrumb';
import { ProductGallery } from '~/components/product/ProductGallery';
import { ProductForm } from '~/components/product/ProductForm';
import { ProductDetails } from '~/components/product/ProductDetails';
import { PriceDisplay } from '~/components/product/PriceDisplay';
import { FeaturedCollection } from '~/components/home/FeaturedCollection';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { handle } = params;

  if (!handle) {
    throw new Response('Product not found', { status: 404 });
  }

  // Mock product data
  const mockProduct = {
    id: `product-${handle}`,
    title: 'Premium Performance T-Shirt',
    handle,
    vendor: 'Under Armour',
    description: 'High-performance moisture-wicking fabric engineered for athletes',
    descriptionHtml: '<p>High-performance moisture-wicking fabric engineered for athletes. Built with UA Storm technology to protect you from water and sweat.</p>',
    images: Array.from({ length: 4 }).map((_, i) => ({
      url: `https://images.unsplash.com/photo-${1550000000000 + i}?w=800&q=80`,
      altText: `View ${i + 1}`,
    })),
    price: '₹3,499',
    compareAtPrice: '₹4,499',
    priceRange: {
      minVariantPrice: {
        amount: '3499',
      },
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Navy', value: '#001F3F' },
      { name: 'Grey', value: '#7F8C8D' },
    ],
    features: [
      'UA Storm water-resistant technology',
      'Moisture-wicking fabric',
      '4-way stretch construction',
      'Flat-lock seams to prevent chafing',
      'Tagless design for comfort',
    ],
  };

  const recommendedProducts = Array.from({ length: 4 }).map((_, i) => ({
    id: `product-${i}`,
    title: `Related Product ${i + 1}`,
    handle: `product-${i}`,
    images: [
      {
        url: `https://images.unsplash.com/photo-${1550000000000 + i}?w=500&q=80`,
        altText: `Product ${i + 1}`,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: `${3000 + i * 500}`,
      },
    },
  }));

  return json({
    product: mockProduct,
    recommendedProducts,
  });
};

export default function ProductPage() {
  const { product, recommendedProducts } = useLoaderData<typeof loader>();

  const handleAddToCart = async (data: {
    size: string;
    color: string;
    quantity: number;
  }) => {
    console.log('Adding to cart:', data);
    // Handle cart addition
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-padding pt-6">
        <Breadcrumb
          items={[
            { label: 'HOME', href: '/' },
            { label: 'PRODUCTS', href: '/collections/all' },
            { label: product.title.toUpperCase() },
          ]}
        />
      </div>

      {/* Product Section */}
      <div className="container-padding section-spacing">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-ua-dark text-uppercase mb-2">
                {product.title}
              </h1>
              <p className="text-ua-grey text-sm mb-4">BY {product.vendor}</p>
              <PriceDisplay
                amount={product.price}
                compareAtAmount={product.compareAtPrice}
              />
            </div>

            {/* Form */}
            <ProductForm
              sizes={product.sizes}
              colors={product.colors}
              onAddToCart={handleAddToCart}
            />

            {/* Details */}
            <ProductDetails
              description={product.description}
              descriptionHtml={product.descriptionHtml}
              features={product.features}
            />
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <FeaturedCollection
        title="YOU MAY ALSO LIKE"
        products={recommendedProducts}
        showViewAll={false}
      />

      {/* Additional Info */}
      <section className="bg-ua-light border-t border-ua-grey">
        <div className="container-padding section-spacing">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-bold text-uppercase mb-2 tracking-widest">Free Shipping</h3>
              <p className="text-ua-grey text-sm">On orders over ₹5,000</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-uppercase mb-2 tracking-widest">Easy Returns</h3>
              <p className="text-ua-grey text-sm">30-day return policy</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-uppercase mb-2 tracking-widest">Authentic</h3>
              <p className="text-ua-grey text-sm">100% genuine products</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
