# Component & Route Reference

## Routes (6 Total)

### Homepage (`app/routes/_index.tsx`)
**Purpose**: Main landing page with hero banner, featured collections, categories, and promotions
**Features**:
- Hero banner with "EMPOWER YOUR PERFORMANCE" messaging
- Shop by gender section (Men/Women)
- New arrivals collection
- Sport category grid (Running, Training, Basketball, Golf)
- Best sellers section
- Promotional banner
- Trending now collection

**Key Components Used**:
- HeroBanner, ShopByGender, FeaturedCollection, CategoryGrid, PromoBanner

---

### Product Detail (`app/routes/products.$handle.tsx`)
**Purpose**: Single product page with full details, images, variants, and recommendations
**Features**:
- Breadcrumb navigation
- Product gallery with thumbnail navigation
- Product name, vendor, price display
- Size selector (XS-XXL)
- Color selector
- Quantity selector
- "Add to Bag" button
- Product description accordion
- Features list
- Care instructions
- Recommended products section
- Free shipping/returns info

**Key Components Used**:
- ProductGallery, ProductForm, ProductDetails, PriceDisplay, FeaturedCollection

---

### Collection (`app/routes/collections.$handle.tsx`)
**Purpose**: Collection/Category page with filtering and sorting
**Features**:
- Collection header with product count
- Filter sidebar with:
  - Gender filter (Men, Women, Kids)
  - Category filter (Tops, Bottoms, Shoes, Accessories)
  - Sport filter (Running, Training, Basketball, Golf)
  - Price range slider
- Sort dropdown (Featured, Newest, Price Low-High, Price High-Low)
- Responsive product grid
- Pagination controls

**Key Components Used**:
- CollectionHeader, FilterSidebar, ProductGrid, SortDropdown

---

### Shopping Cart (`app/routes/cart.tsx`)
**Purpose**: Full shopping cart page
**Features**:
- Cart header with item count
- Cart line items with:
  - Product image, name, size, color
  - Quantity controls (+/-)
  - Remove button
  - Price per item
- Promo code input
- Cart summary (subtotal, total, tax)
- Checkout button
- Free shipping/returns messaging
- "Complete your look" recommended products (when cart has items)
- Empty cart state with "Shop Best Sellers" CTA

**Key Components Used**:
- CartLineItem, CartSummary, ProductGrid

---

### Search Results (`app/routes/search.tsx`)
**Purpose**: Search results page
**Features**:
- Search header with query display
- Result count
- Product grid with matching items
- Empty search state ("What are you looking for?")
- No results state with "Browse All" CTA
- Load more button
- Related products

**Key Components Used**:
- ProductGrid, Button

---

### CMS Pages (`app/routes/pages.$handle.tsx`)
**Purpose**: Static content pages (Privacy, Terms, About, Contact)
**Features**:
- Breadcrumb navigation
- Page title
- HTML content rendering
- Responsive typography

**Supported Pages**:
- `privacy` - Privacy Policy
- `terms` - Terms of Service
- `about` - About Us
- `contact` - Contact Information

**Key Components Used**:
- Breadcrumb

---

## Layout Components (3)

### Header (`app/components/layout/Header.tsx`)
**Props**: None (self-contained)

**Features**:
- Announcement bar ("SIGN UP FOR FASTER CHECKOUT")
- Logo with branding
- Navigation items: New, Men, Women, Shoes, Outlet
- Mega menu on hover for Men/Women with:
  - Tops, Bottoms, Shoes, Accessories categories
  - Multiple collection links under each
- Search icon (opens SearchOverlay)
- Account icon
- Cart icon with item count badge
- Mobile hamburger menu with links
- Mobile responsive layout

**Dependencies**:
- SearchOverlay, React hooks, clsx

---

### Footer (`app/components/layout/Footer.tsx`)
**Props**: None (self-contained)

**Features**:
- Newsletter signup form
- Four-column footer links:
  - Help (Contact, Shipping, FAQ, Size Guide)
  - About (About Us, Sustainability, Careers, Partnerships)
  - Quick Links (New, Outlet, Best Sellers, Featured)
  - Legal (Privacy, Terms, Cookies)
- Payment method icons
- Social media links (Instagram, Facebook, Twitter)
- Copyright info
- Company address

**Dependencies**:
- Button, Link, useState

---

### Layout (`app/components/layout/Layout.tsx`)
**Props**:
```typescript
interface LayoutProps {
  children: ReactNode;
}
```

**Features**:
- Wrapper component combining Header, Footer, and content
- Min-height full screen layout
- Flex layout for sticky footer

---

## Product Components (6)

### ProductCard (`app/components/product/ProductCard.tsx`)
**Props**:
```typescript
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
```

**Features**:
- Product image with hover zoom effect
- Badge overlay (NEW, FEATURED, custom)
- Color swatch dots (up to 4 colors + "+N More")
- Product title
- Price display with compare-at price
- Link to product detail page

---

### ProductGrid (`app/components/product/ProductGrid.tsx`)
**Props**:
```typescript
interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}
```

**Features**:
- Responsive grid (2 cols mobile, 3 tablet, 4 desktop)
- Skeleton loading state
- Empty state message
- Auto-sizing cards

---

### ProductGallery (`app/components/product/ProductGallery.tsx`)
**Props**:
```typescript
interface ProductGalleryProps {
  images: GalleryImage[];
  title: string;
}
```

**Features**:
- Main image display
- Thumbnail selector (left on desktop, below on mobile)
- Hover zoom effect
- Active state indication
- Click to select functionality

---

### ProductForm (`app/components/product/ProductForm.tsx`)
**Props**:
```typescript
interface ProductFormProps {
  sizes: string[];
  colors: Array<{ name: string; value: string }>;
  onAddToCart: (data: {...}) => Promise<void>;
  isLoading?: boolean;
}
```

**Features**:
- Size selector (grid of buttons)
- Color selector (color swatches)
- Quantity selector with +/- buttons
- "Add to Bag" button
- Loading states
- Validation (requires size & color)
- Free shipping/returns info

---

### ProductDetails (`app/components/product/ProductDetails.tsx`)
**Props**:
```typescript
interface ProductDetailsProps {
  description: string;
  descriptionHtml?: string;
  features?: string[];
}
```

**Features**:
- Accordion sections:
  - Description (expanded by default)
  - Features
  - Care Instructions
- Expand/collapse animation
- HTML content support

---

### PriceDisplay (`app/components/product/PriceDisplay.tsx`)
**Props**:
```typescript
interface PriceDisplayProps {
  amount: number | string;
  compareAtAmount?: number | string;
  showTaxNote?: boolean;
}
```

**Features**:
- Price in INR (₹ symbol)
- Compare-at price with strikethrough
- Tax notice ("Inclusive of all taxes")
- Large, bold typography

---

## Collection Components (3)

### FilterSidebar (`app/components/collection/FilterSidebar.tsx`)
**Props**:
```typescript
interface FilterSidebarProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (group: string, value: string, isChecked: boolean) => void;
  priceRange?: { min: number; max: number };
  onPriceChange?: (min: number, max: number) => void;
}
```

**Features**:
- Collapsible filter groups
- Checkbox filters with counts
- Price range slider
- Clear all button
- Sticky positioning
- Mobile responsive

**Built-in Filters**:
- Gender (Men, Women, Kids)
- Category (Tops, Bottoms, Shoes, Accessories)
- Sport (Running, Training, Basketball, Golf)
- Price Range (₹2,500-₹25,000)

---

### SortDropdown (`app/components/collection/SortDropdown.tsx`)
**Props**:
```typescript
interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}
```

**Features**:
- Dropdown menu with sort options
- Current selection highlighted
- Click-outside to close
- Smooth open/close animation

**Sort Options**:
- FEATURED (default)
- NEWEST
- PRICE: LOW TO HIGH
- PRICE: HIGH TO LOW

---

### CollectionHeader (`app/components/collection/CollectionHeader.tsx`)
**Props**:
```typescript
interface CollectionHeaderProps {
  title: string;
  productCount: number;
  description?: string;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
}
```

**Features**:
- Breadcrumb navigation
- Collection title (uppercase)
- Description text
- Product count display
- Sort dropdown
- Mobile filter toggle button

---

## Cart Components (3)

### CartDrawer (`app/components/cart/CartDrawer.tsx`)
**Props**:
```typescript
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
```

**Features**:
- Slide-out drawer from right
- Backdrop overlay
- Header with close button
- Scrollable items list
- Empty cart state with "Shop Best Sellers" CTA
- Cart summary with checkout button
- Accessible ARIA labels

---

### CartLineItem (`app/components/cart/CartLineItem.tsx`)
**Props**:
```typescript
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
```

**Features**:
- Product image (clickable link to PDP)
- Product name (clickable link to PDP)
- Size and color display
- Line item total price
- Quantity controls (+/- buttons, input field)
- Remove button
- Responsive layout

---

### CartSummary (`app/components/cart/CartSummary.tsx`)
**Props**:
```typescript
interface CartSummaryProps {
  subtotal: string;
  tax?: string;
  shipping?: string;
  total: string;
  checkoutUrl?: string;
  onCheckout?: () => void;
  isLoading?: boolean;
}
```

**Features**:
- Subtotal line
- Shipping line (optional)
- Tax line (optional)
- Total (bold, large)
- "Proceed to Checkout" button
- Free shipping messaging
- Easy returns messaging

---

## Home Components (5)

### HeroBanner (`app/components/home/HeroBanner.tsx`)
**Props**:
```typescript
interface HeroBannerProps {
  image: string;
  heading: string;
  subheading?: string;
  ctaText: string;
  ctaUrl: string;
  alignment?: 'center' | 'left' | 'right';
}
```

**Features**:
- Full-screen hero with background image
- Dark overlay
- Large heading (up to 7xl)
- Subheading text
- CTA button
- Content alignment options
- Responsive sizing

---

### FeaturedCollection (`app/components/home/FeaturedCollection.tsx`)
**Props**:
```typescript
interface FeaturedCollectionProps {
  title: string;
  collectionUrl?: string;
  products: Product[];
  showViewAll?: boolean;
}
```

**Features**:
- Section title
- "View All" button linking to collection
- Product grid (4 columns desktop)
- No product state
- Flexible product count

---

### CategoryGrid (`app/components/home/CategoryGrid.tsx`)
**Props**:
```typescript
interface CategoryGridProps {
  categories: Category[];
}
```

**Features**:
- "Shop by Sport" section title
- 2-column mobile, 4-column desktop grid
- Category cards with images
- Hover zoom and darkening effect
- Category name overlay
- Links to category pages

---

### ShopByGender (`app/components/home/ShopByGender.tsx`)
**Props**:
```typescript
interface ShopByGenderProps {
  menImage?: string;
  womenImage?: string;
}
```

**Features**:
- Two-column layout
- Men/Women image cards
- Large "Shop Men" / "Shop Women" headings
- Explore buttons
- Hover effects
- Responsive layout

---

### PromoBanner (`app/components/home/PromoBanner.tsx`)
**Props**:
```typescript
interface PromoBannerProps {
  image: string;
  title: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  backgroundColor?: string;
}
```

**Features**:
- Two-column layout (image + content)
- Customizable background color
- Large title text
- Description text
- CTA button
- Responsive stacking

---

## UI Components (5)

### Button (`app/components/ui/Button.tsx`)
**Props**:
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}
```

**Features**:
- Three variants:
  - Primary: Black bg, white text
  - Secondary: Dark bg, light text
  - Outline: Transparent, dark border
- Three sizes: sm, md, lg
- Loading state with spinner
- Disabled state styling
- Sharp corners (no border-radius)
- Uppercase text

---

### Badge (`app/components/ui/Badge.tsx`)
**Props**:
```typescript
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}
```

**Features**:
- Four color variants
- Two sizes (sm, md)
- Uppercase text
- Inline display

---

### Breadcrumb (`app/components/ui/Breadcrumb.tsx`)
**Props**:
```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}
```

**Features**:
- Navigation breadcrumb trail
- Last item is current (not clickable)
- Slash separators
- Hover effects on links

---

### SearchOverlay (`app/components/ui/SearchOverlay.tsx`)
**Props**:
```typescript
interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Features**:
- Full-screen search modal
- Search input field
- Auto-focus on open
- ESC key to close
- Backdrop overlay
- Result navigation to search results page
- Helpful placeholder text

---

### Spinner (`app/components/ui/Spinner.tsx`)
**Props**:
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Features**:
- Animated loading spinner
- Three sizes
- SVG-based (scalable)
- Customizable color via className

---

## Component Dependency Graph

```
Layout (root wrapper)
├── Header
│   ├── SearchOverlay (modal)
│   └── Navigation Links
├── Route Component (page content)
│   ├── [page-specific components]
│   └── [reusable sub-components]
└── Footer

Product Pages
├── ProductGallery
├── ProductForm
├── PriceDisplay
├── ProductDetails
└── ProductGrid (recommendations)

Collection Pages
├── CollectionHeader
├── FilterSidebar
├── ProductGrid
└── SortDropdown

Cart Pages
├── CartDrawer
├── CartLineItem (repeating)
├── CartSummary
└── ProductGrid (related)

Home Page
├── HeroBanner
├── ShopByGender
├── FeaturedCollection (repeating)
├── CategoryGrid
└── PromoBanner
```

---

## Typography Classes

```jsx
// Headings
<h1 className="text-4xl font-bold text-uppercase">H1</h1>
<h2 className="text-3xl font-bold text-uppercase">H2</h2>
<h3 className="text-2xl font-bold text-uppercase">H3</h3>
<h4 className="text-xl font-bold text-uppercase">H4</h4>

// Body
<p className="text-base text-ua-grey">Body text</p>
<p className="text-sm text-ua-grey">Small text</p>
<p className="text-xs text-ua-grey">Extra small text</p>
```

---

## Utility Classes

```jsx
// Spacing
<div className="container-padding">Padding with responsive width</div>
<div className="section-spacing">Vertical section spacing</div>

// Grid
<div className="product-grid">Auto-responsive product grid</div>

// Text
<p className="text-uppercase">Uppercase with letter spacing</p>

// State
<button className="disabled:opacity-50">Disabled button</button>
<div className="hover:opacity-80">Hover effect</div>
```

---

**Total Components**: 25
**Total Routes**: 6
**Total Utilities**: 30+
**Lines of Code**: ~3,500+
