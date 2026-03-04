import { useState, useRef, useEffect } from 'react';
import { Link } from '@remix-run/react';
import clsx from 'clsx';
import { SearchOverlay } from '../ui/SearchOverlay';

interface MegaMenuCategory {
  name: string;
  href: string;
}

interface MegaMenuColumn {
  title: string;
  items: MegaMenuCategory[];
}

const megaMenuData: Record<string, MegaMenuColumn[]> = {
  men: [
    {
      title: 'TOPS',
      items: [
        { name: 'T-Shirts', href: '/collections/mens-tshirts' },
        { name: 'Shirts', href: '/collections/mens-shirts' },
        { name: 'Hoodies', href: '/collections/mens-hoodies' },
        { name: 'Jackets', href: '/collections/mens-jackets' },
      ],
    },
    {
      title: 'BOTTOMS',
      items: [
        { name: 'Shorts', href: '/collections/mens-shorts' },
        { name: 'Joggers', href: '/collections/mens-joggers' },
        { name: 'Pants', href: '/collections/mens-pants' },
        { name: 'Leggings', href: '/collections/mens-leggings' },
      ],
    },
    {
      title: 'SHOES',
      items: [
        { name: 'Running', href: '/collections/mens-running-shoes' },
        { name: 'Training', href: '/collections/mens-training-shoes' },
        { name: 'Basketball', href: '/collections/mens-basketball-shoes' },
        { name: 'Casual', href: '/collections/mens-casual-shoes' },
      ],
    },
    {
      title: 'ACCESSORIES',
      items: [
        { name: 'Bags', href: '/collections/mens-bags' },
        { name: 'Caps', href: '/collections/mens-caps' },
        { name: 'Socks', href: '/collections/mens-socks' },
        { name: 'Watches', href: '/collections/mens-watches' },
      ],
    },
  ],
  women: [
    {
      title: 'TOPS',
      items: [
        { name: 'Sports Bras', href: '/collections/womens-sports-bras' },
        { name: 'T-Shirts', href: '/collections/womens-tshirts' },
        { name: 'Tanks', href: '/collections/womens-tanks' },
        { name: 'Jackets', href: '/collections/womens-jackets' },
      ],
    },
    {
      title: 'BOTTOMS',
      items: [
        { name: 'Shorts', href: '/collections/womens-shorts' },
        { name: 'Leggings', href: '/collections/womens-leggings' },
        { name: 'Pants', href: '/collections/womens-pants' },
        { name: 'Capris', href: '/collections/womens-capris' },
      ],
    },
    {
      title: 'SHOES',
      items: [
        { name: 'Running', href: '/collections/womens-running-shoes' },
        { name: 'Training', href: '/collections/womens-training-shoes' },
        { name: 'Yoga', href: '/collections/womens-yoga-shoes' },
        { name: 'Casual', href: '/collections/womens-casual-shoes' },
      ],
    },
    {
      title: 'ACCESSORIES',
      items: [
        { name: 'Bags', href: '/collections/womens-bags' },
        { name: 'Headwear', href: '/collections/womens-headwear' },
        { name: 'Socks', href: '/collections/womens-socks' },
        { name: 'Watches', href: '/collections/womens-watches' },
      ],
    },
  ],
};

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = (menu: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMegaMenu(menu);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-ua-dark text-ua-light py-2 text-center text-xs md:text-sm font-bold text-uppercase tracking-widest">
        SIGN UP FOR FASTER CHECKOUT
      </div>

      {/* Main Header */}
      <header className="bg-ua-light border-b border-ua-grey">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between px-6 py-4 container-padding">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-ua-dark text-uppercase hover:text-ua-grey transition-colors"
            >
              UNDER ARMOUR
            </Link>

            {/* Center Navigation */}
            <nav className="flex items-center gap-8">
              <Link
                to="/collections/new"
                className="text-uppercase text-sm font-bold text-ua-dark hover:text-ua-grey transition-colors"
              >
                New
              </Link>

              <div
                onMouseEnter={() => handleMouseEnter('men')}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <button className="text-uppercase text-sm font-bold text-ua-dark hover:text-ua-grey transition-colors">
                  Men
                </button>

                {activeMegaMenu === 'men' && (
                  <MegaMenu
                    columns={megaMenuData.men}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </div>

              <div
                onMouseEnter={() => handleMouseEnter('women')}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <button className="text-uppercase text-sm font-bold text-ua-dark hover:text-ua-grey transition-colors">
                  Women
                </button>

                {activeMegaMenu === 'women' && (
                  <MegaMenu
                    columns={megaMenuData.women}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </div>

              <Link
                to="/collections/shoes"
                className="text-uppercase text-sm font-bold text-ua-dark hover:text-ua-grey transition-colors"
              >
                Shoes
              </Link>

              <Link
                to="/collections/outlet"
                className="text-uppercase text-sm font-bold text-ua-dark hover:text-ua-grey transition-colors"
              >
                Outlet
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-ua-dark hover:text-ua-grey transition-colors"
                aria-label="Search"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <Link
                to="/account"
                className="text-ua-dark hover:text-ua-grey transition-colors"
                aria-label="Account"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>

              <Link
                to="/cart"
                className="relative text-ua-dark hover:text-ua-grey transition-colors"
                aria-label="Cart"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 bg-ua-dark text-ua-light w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between px-4 py-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-ua-dark"
            aria-label="Menu"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link
            to="/"
            className="text-lg font-bold text-ua-dark text-uppercase"
          >
            UA
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-ua-dark"
              aria-label="Search"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <Link to="/cart" className="relative text-ua-dark">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-ua-dark text-ua-light w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-ua-light border-t border-ua-grey">
            <nav className="flex flex-col">
              <Link
                to="/collections/new"
                className="px-4 py-3 text-uppercase text-sm font-bold text-ua-dark border-b border-ua-grey hover:bg-gray-50"
              >
                New
              </Link>
              <Link
                to="/collections/mens"
                className="px-4 py-3 text-uppercase text-sm font-bold text-ua-dark border-b border-ua-grey hover:bg-gray-50"
              >
                Men
              </Link>
              <Link
                to="/collections/womens"
                className="px-4 py-3 text-uppercase text-sm font-bold text-ua-dark border-b border-ua-grey hover:bg-gray-50"
              >
                Women
              </Link>
              <Link
                to="/collections/shoes"
                className="px-4 py-3 text-uppercase text-sm font-bold text-ua-dark border-b border-ua-grey hover:bg-gray-50"
              >
                Shoes
              </Link>
              <Link
                to="/collections/outlet"
                className="px-4 py-3 text-uppercase text-sm font-bold text-ua-dark hover:bg-gray-50"
              >
                Outlet
              </Link>
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

interface MegaMenuProps {
  columns: MegaMenuColumn[];
  onMouseLeave: () => void;
}

function MegaMenu({ columns, onMouseLeave }: MegaMenuProps) {
  return (
    <div
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 bg-ua-light border-t-2 border-ua-dark shadow-lg"
    >
      <div className="grid grid-cols-4 gap-8 p-6 container-padding">
        {columns.map((column, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-bold text-uppercase text-ua-dark mb-4 tracking-widest">
              {column.title}
            </h3>
            <ul className="space-y-2">
              {column.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-ua-grey hover:text-ua-dark transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
