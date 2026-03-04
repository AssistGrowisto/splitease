import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { ProductGrid } from '~/components/product/ProductGrid';
import { Button } from '~/components/ui/Button';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  // Mock search results
  const mockResults = query
    ? Array.from({ length: 12 }).map((_, i) => ({
        id: `product-${i}`,
        title: `Product matching "${query}" ${i + 1}`,
        handle: `product-${i}`,
        images: [
          {
            url: `https://images.unsplash.com/photo-${1550000000000 + i}?w=500&q=80`,
            altText: `Product ${i + 1}`,
          },
        ],
        priceRange: {
          minVariantPrice: {
            amount: `${3000 + Math.random() * 20000}`,
          },
        },
      }))
    : [];

  return json({
    query,
    results: mockResults,
    resultCount: mockResults.length,
  });
};

export default function SearchPage() {
  const { query, results, resultCount } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div>
      {/* Search Header */}
      <div className="container-padding pt-6 pb-12 border-b border-ua-grey">
        <h1 className="text-4xl font-bold text-ua-dark text-uppercase mb-4">
          SEARCH RESULTS
        </h1>
        {query && (
          <p className="text-ua-grey text-lg">
            {resultCount} results for "<span className="font-bold">{query}</span>"
          </p>
        )}
      </div>

      <div className="container-padding section-spacing">
        {!query ? (
          /* No Query */
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 text-ua-grey mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-ua-dark mb-4">WHAT ARE YOU LOOKING FOR?</h2>
            <p className="text-ua-grey mb-8">Use the search bar to find products</p>
          </div>
        ) : results.length === 0 ? (
          /* No Results */
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 text-ua-grey mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-ua-dark mb-4">NO RESULTS FOUND</h2>
            <p className="text-ua-grey mb-8">
              Try different keywords or browse our collections
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg">
                <a href="/collections/all">BROWSE ALL</a>
              </Button>
              <Button variant="outline" size="lg">
                <a href="/">BACK TO HOME</a>
              </Button>
            </div>
          </div>
        ) : (
          /* Results */
          <>
            <ProductGrid products={results} />

            {/* Load More */}
            <div className="flex items-center justify-center mt-12 pt-12 border-t border-ua-grey">
              <Button variant="secondary" size="lg">
                LOAD MORE
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
