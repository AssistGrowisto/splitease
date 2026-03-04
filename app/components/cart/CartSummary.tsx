import { Button } from '../ui/Button';

interface CartSummaryProps {
  subtotal: string;
  tax?: string;
  shipping?: string;
  total: string;
  checkoutUrl?: string;
  onCheckout?: () => void;
  isLoading?: boolean;
}

export function CartSummary({
  subtotal,
  tax,
  shipping,
  total,
  checkoutUrl,
  onCheckout,
  isLoading,
}: CartSummaryProps) {
  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <div className="bg-ua-light border-t border-ua-grey p-6 space-y-4">
      {/* Subtotal */}
      <div className="flex items-center justify-between text-ua-dark">
        <span className="text-sm">SUBTOTAL</span>
        <span className="font-bold">{subtotal}</span>
      </div>

      {/* Shipping */}
      {shipping && (
        <div className="flex items-center justify-between text-ua-dark">
          <span className="text-sm">SHIPPING</span>
          <span className="font-bold">{shipping}</span>
        </div>
      )}

      {/* Tax */}
      {tax && (
        <div className="flex items-center justify-between text-ua-grey text-sm">
          <span>TAX</span>
          <span>{tax}</span>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-ua-grey pt-4 flex items-center justify-between">
        <span className="font-bold text-uppercase">TOTAL</span>
        <span className="text-2xl font-bold">{total}</span>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={handleCheckout}
        isLoading={isLoading}
        className="w-full"
      >
        PROCEED TO CHECKOUT
      </Button>

      {/* Info Text */}
      <div className="text-xs text-ua-grey text-center space-y-1 pt-4 border-t border-ua-grey">
        <p>Free shipping on orders over ₹5,000</p>
        <p>Easy returns within 30 days</p>
      </div>
    </div>
  );
}
