import { Link } from '@remix-run/react';
import { formatPrice } from '~/lib/shopify';

interface CartLineItemProps {
  id: string;
  productTitle: string;
  productHandle: string;
  image?: { url: string; altText?: string };
  size?: string;
  color?: string;
  quantity: number;
  price: string;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export function CartLineItem({
  id,
  productTitle,
  productHandle,
  image,
  size,
  color,
  quantity,
  price,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  return (
    <div className="flex gap-4 pb-6 border-b border-ua-grey last:border-0">
      {/* Product Image */}
      {image && (
        <Link
          to={`/products/${productHandle}`}
          className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-gray-100"
        >
          <img
            src={image.url}
            alt={image.altText || productTitle}
            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
          />
        </Link>
      )}

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <Link
            to={`/products/${productHandle}`}
            className="font-bold text-ua-dark hover:text-ua-grey transition-colors block mb-2"
          >
            {productTitle}
          </Link>

          {/* Options */}
          <div className="text-sm text-ua-grey space-y-1 mb-3">
            {size && <p>Size: {size}</p>}
            {color && <p>Color: {color}</p>}
          </div>

          {/* Price */}
          <p className="font-bold text-ua-dark mb-4">{formatPrice(numPrice * quantity)}</p>
        </div>

        {/* Quantity & Remove */}
        <div className="flex items-center justify-between">
          {/* Quantity Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              className="w-8 h-8 border-2 border-ua-grey text-ua-dark hover:border-ua-dark transition-colors text-sm"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
              className="w-12 text-center border-2 border-ua-grey text-ua-dark focus:outline-none text-sm"
              min="0"
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-8 h-8 border-2 border-ua-grey text-ua-dark hover:border-ua-dark transition-colors text-sm"
            >
              +
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={onRemove}
            className="text-ua-grey hover:text-ua-dark text-sm font-bold transition-colors"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}
