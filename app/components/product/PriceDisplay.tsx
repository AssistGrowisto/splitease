import { formatPrice } from '~/lib/shopify';

interface PriceDisplayProps {
  amount: number | string;
  compareAtAmount?: number | string;
  showTaxNote?: boolean;
}

export function PriceDisplay({
  amount,
  compareAtAmount,
  showTaxNote = true,
}: PriceDisplayProps) {
  const price = typeof amount === 'string' ? parseFloat(amount) : amount;
  const originalPrice = compareAtAmount
    ? typeof compareAtAmount === 'string'
      ? parseFloat(compareAtAmount)
      : compareAtAmount
    : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl md:text-3xl font-bold text-ua-dark">
          {formatPrice(price)}
        </span>
        {originalPrice && originalPrice > price && (
          <span className="text-lg text-ua-grey line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
      {showTaxNote && (
        <p className="text-xs text-ua-grey">Inclusive of all taxes</p>
      )}
    </div>
  );
}
