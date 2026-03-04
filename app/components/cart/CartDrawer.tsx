import { Link } from '@remix-run/react';
import clsx from 'clsx';
import { CartLineItem } from './CartLineItem';
import { CartSummary } from './CartSummary';

interface CartItem {
  id: string;
  productTitle: string;
  productHandle: string;
  image?: { url: string; altText?: string };
  size?: string;
  color?: string;
  quantity: number;
  price: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: string;
  total: string;
  tax?: string;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout?: () => void;
  checkoutUrl?: string;
  isLoading?: boolean;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  subtotal,
  total,
  tax,
  onQuantityChange,
  onRemove,
  onCheckout,
  checkoutUrl,
  isLoading,
}: CartDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-full md:w-96 bg-ua-light shadow-lg z-50 flex flex-col transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ua-grey">
          <h2 className="text-2xl font-bold text-uppercase">YOUR BAG</h2>
          <button
            onClick={onClose}
            className="text-ua-dark hover:text-ua-grey transition-colors"
            aria-label="Close cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-16 h-16 text-ua-grey mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-ua-dark font-bold mb-4">YOUR BAG IS EMPTY</p>
              <p className="text-ua-grey text-sm mb-6">
                Start shopping to add items to your bag
              </p>
              <Link
                to="/collections/best-sellers"
                onClick={onClose}
                className="px-6 py-3 bg-ua-dark text-ua-light font-bold text-uppercase text-sm hover:bg-ua-grey transition-colors"
              >
                SHOP BEST SELLERS
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  {...item}
                  onQuantityChange={(qty) =>
                    onQuantityChange(item.id, qty)
                  }
                  onRemove={() => onRemove(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary & Checkout */}
        {items.length > 0 && (
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            checkoutUrl={checkoutUrl}
            onCheckout={onCheckout}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
}
