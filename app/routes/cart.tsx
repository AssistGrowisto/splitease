import { useState } from 'react';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, Link } from '@remix-run/react';
import { CartLineItem } from '~/components/cart/CartLineItem';
import { CartSummary } from '~/components/cart/CartSummary';
import { Button } from '~/components/ui/Button';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  // Mock cart data
  const mockCart = {
    items: [
      {
        id: 'line-1',
        productTitle: 'Premium Performance T-Shirt',
        productHandle: 'performance-tshirt',
        image: {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
          altText: 'Premium Performance T-Shirt',
        },
        size: 'M',
        color: 'Black',
        quantity: 2,
        price: '3499',
      },
      {
        id: 'line-2',
        productTitle: 'Sports Training Shorts',
        productHandle: 'training-shorts',
        image: {
          url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80',
          altText: 'Sports Training Shorts',
        },
        size: 'L',
        color: 'Navy',
        quantity: 1,
        price: '2499',
      },
    ],
    subtotal: '₹9,497',
    total: '₹9,497',
    tax: '₹0',
    checkoutUrl: 'https://checkout.example.com',
  };

  return json({
    cart: mockCart,
  });
};

export default function CartPage() {
  const { cart } = useLoaderData<typeof loader>();
  const [items, setItems] = useState(cart.items);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity === 0) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal;

  return (
    <div>
      {/* Header */}
      <div className="container-padding pt-6">
        <h1 className="text-4xl font-bold text-ua-dark text-uppercase mb-2">YOUR BAG</h1>
        <p className="text-ua-grey text-sm">{items.length} ITEMS</p>
      </div>

      <div className="container-padding section-spacing">
        {items.length === 0 ? (
          /* Empty Cart */
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-ua-dark mb-4">YOUR BAG IS EMPTY</h2>
            <p className="text-ua-grey mb-8">Start shopping to add items to your bag</p>
            <Link to="/collections/all">
              <Button variant="primary" size="lg">
                CONTINUE SHOPPING
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="border-b border-ua-grey pb-6 mb-6">
                {items.map((item) => (
                  <CartLineItem
                    key={item.id}
                    {...item}
                    onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <h3 className="font-bold text-uppercase text-sm mb-4 tracking-widest">
                  PROMO CODE
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-grow px-4 py-3 border-2 border-ua-grey focus:outline-none focus:border-ua-dark"
                  />
                  <Button variant="secondary" size="md">
                    APPLY
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm text-ua-grey">
                <p>✓ Free shipping on orders over ₹5,000</p>
                <p>✓ Easy returns within 30 days</p>
                <p>✓ Secure checkout</p>
              </div>
            </div>

            {/* Summary */}
            <div>
              <CartSummary
                subtotal={`₹${subtotal.toLocaleString('en-IN')}`}
                total={`₹${total.toLocaleString('en-IN')}`}
                checkoutUrl={cart.checkoutUrl}
              />
            </div>
          </div>
        )}
      </div>

      {/* Related Products Banner */}
      {items.length > 0 && (
        <section className="bg-ua-light border-t border-ua-grey">
          <div className="container-padding section-spacing">
            <h2 className="text-2xl font-bold text-ua-dark text-uppercase mb-6">
              COMPLETE YOUR LOOK
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-100 aspect-square hover:opacity-80 transition-opacity cursor-pointer" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
