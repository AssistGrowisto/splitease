import { useState } from 'react';
import { Link } from '@remix-run/react';
import { Button } from '../ui/Button';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-ua-dark text-ua-light mt-12 md:mt-20">
      {/* Newsletter Signup */}
      <div className="border-b border-ua-grey">
        <div className="container-padding section-spacing">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-uppercase mb-4">
              Newsletter Sign Up
            </h3>
            <p className="text-ua-grey mb-6">
              Get exclusive offers, promotions, and style tips delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-ua-light text-ua-dark placeholder-ua-grey border-0 focus:outline-none"
              />
              <Button
                variant="secondary"
                size="md"
                type="submit"
                className="md:w-auto"
              >
                SUBSCRIBE
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="container-padding section-spacing">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Help */}
          <div>
            <h4 className="font-bold text-uppercase text-sm mb-4 tracking-widest">
              Help
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help/contact"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/help/shipping"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/help/faq"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/help/size-guide"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-uppercase text-sm mb-4 tracking-widest">
              About
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/pages/about"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/sustainability"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/careers"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/partnerships"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Partnerships
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-uppercase text-sm mb-4 tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/collections/new"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/outlet"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Outlet
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/best-sellers"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/featured"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-uppercase text-sm mb-4 tracking-widest">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/pages/privacy"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/terms"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/cookies"
                  className="text-ua-grey hover:text-ua-light transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-ua-grey pt-8 mb-8">
          <h4 className="font-bold text-uppercase text-sm mb-4 tracking-widest">
            Payment Methods
          </h4>
          <div className="flex flex-wrap gap-4">
            <PaymentIcon name="Visa" icon="💳" />
            <PaymentIcon name="Mastercard" icon="💳" />
            <PaymentIcon name="UPI" icon="₹" />
            <PaymentIcon name="AMEX" icon="💳" />
            <PaymentIcon name="PayPal" icon="🅿️" />
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-ua-grey pt-8">
          <h4 className="font-bold text-uppercase text-sm mb-4 tracking-widest">
            Follow Us
          </h4>
          <div className="flex gap-6">
            <a
              href="https://instagram.com"
              className="text-ua-grey hover:text-ua-light transition-colors"
              aria-label="Instagram"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              className="text-ua-grey hover:text-ua-light transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              className="text-ua-grey hover:text-ua-light transition-colors"
              aria-label="Twitter"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-7.006 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.072 4.072 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.616 11.616 0 0 0 6.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-ua-grey bg-ua-black">
        <div className="container-padding py-6 text-center text-ua-grey text-sm">
          <p>&copy; {new Date().getFullYear()} Under Armour. All rights reserved.</p>
          <p className="mt-2">Registered Office: Under Armour India, New Delhi</p>
        </div>
      </div>
    </footer>
  );
}

interface PaymentIconProps {
  name: string;
  icon: string;
}

function PaymentIcon({ name, icon }: PaymentIconProps) {
  return (
    <div
      className="flex items-center justify-center w-12 h-8 bg-ua-light rounded-sm text-lg"
      title={name}
    >
      {icon}
    </div>
  );
}
