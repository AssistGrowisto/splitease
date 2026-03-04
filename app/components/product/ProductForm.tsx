import { useState } from 'react';
import { Button } from '../ui/Button';

interface ProductFormProps {
  sizes: string[];
  colors: Array<{ name: string; value: string }>;
  onAddToCart: (data: { size: string; color: string; quantity: number }) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({
  sizes,
  colors,
  onAddToCart,
  isLoading,
}: ProductFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddToCart({
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-uppercase mb-3 tracking-widest">
            SIZE
          </label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-3 border-2 font-bold text-sm transition-all ${
                  selectedSize === size
                    ? 'border-ua-dark bg-ua-dark text-ua-light'
                    : 'border-ua-grey text-ua-dark hover:border-ua-dark'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-uppercase mb-3 tracking-widest">
            COLOR
          </label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`flex items-center justify-center w-12 h-12 border-2 rounded-sm transition-all ${
                  selectedColor === color.value
                    ? 'border-ua-dark scale-110'
                    : 'border-ua-grey hover:border-ua-dark'
                }`}
                title={color.name}
              >
                <div
                  className="w-10 h-10"
                  style={{ backgroundColor: color.value }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-bold text-uppercase mb-3 tracking-widest">
          QUANTITY
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border-2 border-ua-dark text-ua-dark hover:bg-ua-dark hover:text-ua-light transition-colors"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-16 text-center border-2 border-ua-grey px-2 py-2 focus:outline-none"
            min="1"
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border-2 border-ua-dark text-ua-dark hover:bg-ua-dark hover:text-ua-light transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Bag Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting || isLoading}
        className="w-full"
      >
        ADD TO BAG
      </Button>

      {/* Info Text */}
      <div className="pt-4 border-t border-ua-grey text-xs text-ua-grey space-y-2">
        <p>Free shipping on orders over ₹5,000</p>
        <p>Easy returns within 30 days</p>
      </div>
    </form>
  );
}
