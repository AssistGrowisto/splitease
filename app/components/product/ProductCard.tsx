import { Link } from '@remix-run/react';
import { Badge } from '../ui/Badge';
import { PriceDisplay } from './PriceDisplay';
import { formatPrice } from '~/lib/shopify';

interface Image {
  url: string;
  altText?: string;
}

interface ProductVariant {
  selectedOptions?: Array<{ name: string; value: string }>;
}

interface ProductCardProps {
  id: string;
  title: string;
  handle: string;
  image?: Image;
  price: number | string;
  compareAtPrice?: number | string;
  badge?: string;
  colors?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export function ProductCard({
  id,
  title,
  handle,
  image,
  price,
  compareAtPrice,
  badge,
  colors = [],
  isNew,
  isFeatured,
}: ProductCardProps) {
  return (
    <Link to={`/products/${handle}`} className="group">
      <div className="relative bg-gray-100 aspect-square overflow-hidden mb-4">
        {/* Image */}
        {image && (
          <img
            src={image.url}
            alt={image.altText || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && <Badge variant="default">NEW</Badge>}
          {isFeatured && <Badge variant="default">FEATURED</Badge>}
          {badge && <Badge variant="default">{badge}</Badge>}
        </div>

        {/* Color Swatches Overlay */}
        {colors.length > 0 && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {colors.slice(0, 4).map((color, idx) => (
              <div
                key={idx}
                className="w-4 h-4 rounded-full border-2 border-ua-dark"
                style={{ backgroundColor: color }}
                title={`Color ${idx + 1}`}
              />
            ))}
            {colors.length > 4 && (
              <div className="w-4 h-4 rounded-full border-2 border-ua-dark bg-ua-dark flex items-center justify-center text-white text-xs font-bold">
                +{colors.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="text-center md:text-left">
        <h3 className="text-sm md:text-base font-bold text-ua-dark line-clamp-2 mb-2 group-hover:text-ua-grey transition-colors">
          {title}
        </h3>
        <PriceDisplay
          amount={price}
          compareAtAmount={compareAtPrice}
          showTaxNote={false}
        />
      </div>
    </Link>
  );
}
