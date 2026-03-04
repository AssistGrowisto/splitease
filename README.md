# Under Armour India - Shopify Hydrogen Storefront

A production-ready Shopify Hydrogen v2 (Remix-based) storefront for Under Armour India, featuring a modern design system, responsive components, and full e-commerce functionality.

## Features

- **Modern Design System**: Clean, minimal black & white athletic brand aesthetic
- **Responsive Components**: Mobile-first design optimized for all devices
- **Full E-commerce**: Product listings, collections, cart, checkout integration
- **Advanced Filtering**: Sort and filter by category, price, sport, gender
- **Product Pages**: Rich product details with gallery, sizing, colors
- **User Experience**: Search functionality, product recommendations, promotions
- **Shopify Integration**: Storefront API integration for real products
- **TypeScript**: Fully typed codebase for better development experience

## Project Structure

```
.
├── app/
│   ├── components/          # Reusable React components
│   │   ├── layout/          # Header, Footer, Layout
│   │   ├── product/         # Product cards, gallery, forms
│   │   ├── collection/      # Filter sidebar, sort dropdown
│   │   ├── cart/            # Cart drawer, line items, summary
│   │   ├── home/            # Hero banners, featured collections
│   │   └── ui/              # UI primitives (Button, Badge, etc)
│   ├── routes/              # Remix route handlers
│   ├── graphql/             # GraphQL queries and fragments
│   ├── lib/                 # Utility functions (Shopify, formatting)
│   ├── styles/              # Global CSS and Tailwind imports
│   ├── root.tsx             # Root layout
│   ├── entry.server.tsx     # Server entry point
│   └── entry.client.tsx     # Client entry point
├── package.json             # Dependencies and scripts
├── remix.config.js          # Remix configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── server.ts                # Oxygen/Cloudflare server
└── .env.example             # Environment variables template
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your Shopify Storefront credentials:

```bash
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=your_token_here
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_token_here
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Design System

### Colors
- Primary Text: `#1D1D1D` (`ua-dark`)
- Secondary Text: `#5F5F5F` (`ua-grey`)
- White/Background: `#FFFFFF` (`ua-light`)
- Black: `#000000` (`ua-black`)

### Typography
- Font Family: Inter (Google Fonts)
- All headings: Bold, uppercase
- Body text: Regular weight, proper line height

### Spacing Scale
- XS: 4px, SM: 8px, MD: 12px, LG: 16px, XL: 24px, 2XL: 32px, 3XL: 48px, 4XL: 64px

### Components

#### Button
Primary, secondary, and outline variants with sizes (sm, md, lg)
```jsx
<Button variant="primary" size="lg">SHOP NOW</Button>
```

#### ProductCard
Displays product with image, name, price, and color swatches
```jsx
<ProductCard
  title="Product Name"
  handle="product-handle"
  price="5999"
  colors={['#000000', '#FFFFFF']}
/>
```

#### ProductGrid
Responsive grid (2 cols mobile, 3 tablet, 4 desktop)
```jsx
<ProductGrid products={products} />
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured collections |
| `/products/:handle` | Product detail page |
| `/collections/:handle` | Collection with filtering & sorting |
| `/cart` | Shopping cart page |
| `/search` | Product search results |
| `/pages/:handle` | CMS pages (privacy, terms, etc) |

## Components

### Layout
- **Header**: Navigation with mega menu, search, cart icon
- **Footer**: Newsletter signup, links, social media, payment methods
- **Layout**: Wrapper for Header + content + Footer

### Product
- **ProductCard**: Product showcase with price and colors
- **ProductGrid**: Responsive grid layout
- **ProductGallery**: Image gallery with thumbnails
- **ProductForm**: Size/color/quantity selection
- **ProductDetails**: Accordion with description & features
- **PriceDisplay**: Currency-formatted prices in INR

### Collection
- **FilterSidebar**: Category, price, sport, gender filters
- **SortDropdown**: Sort by featured, price, newest
- **CollectionHeader**: Title, product count, controls

### Cart
- **CartDrawer**: Slide-out cart sidebar
- **CartLineItem**: Product line with qty controls
- **CartSummary**: Subtotal, tax, total, checkout

### Home
- **HeroBanner**: Full-width hero with overlay
- **FeaturedCollection**: Section with product cards
- **CategoryGrid**: Sport category grid
- **ShopByGender**: Men/Women shop sections
- **PromoBanner**: Promotional banner section

### UI
- **Button**: Primary/secondary/outline buttons
- **Badge**: Status badges (New, Featured)
- **Breadcrumb**: Navigation breadcrumbs
- **SearchOverlay**: Full-screen search
- **Spinner**: Loading indicator

## GraphQL Integration

All GraphQL queries are modular and reusable:

```typescript
import { PRODUCT_FRAGMENT } from '~/lib/fragments';
import { GET_PRODUCT } from '~/graphql/product';

const product = await storefrontFetch(GET_PRODUCT, { handle });
```

### Available Queries
- **Product**: Individual product with variants, images
- **Collection**: Products filtered, sorted, paginated
- **Cart**: Create, update, remove items
- **Search**: Full-text product search
- **Customer**: Account info and addresses

## Styling

Uses **Tailwind CSS** with custom Under Armour design tokens:

```jsx
<div className="bg-ua-dark text-ua-light">
  <h1 className="text-4xl font-bold text-uppercase">HEADING</h1>
</div>
```

Custom utilities:
- `.text-uppercase` - Uppercase text with letter spacing
- `.container-padding` - Responsive horizontal padding
- `.section-spacing` - Vertical spacing (y-axis)
- `.product-grid` - Responsive product grid

## Performance Optimization

- Image optimization with Shopify CDN
- Lazy loading for collections and search
- Skeleton loading states
- Efficient component structure with React hooks

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: iOS Safari 12+, Chrome for Android

## Contributing

When adding new components:

1. Create TypeScript interfaces for all props
2. Use Tailwind utilities only (no separate CSS)
3. Follow existing naming conventions
4. Add comprehensive JSDoc comments
5. Test responsive behavior on mobile/tablet/desktop

## Deployment

### Cloudflare Pages
```bash
npm run build
npm run start
```

### Vercel / Other Platforms
See Hydrogen deployment docs: https://hydrogen.shopify.dev/deploy

## API Integration

Connect to your Shopify store:

1. Create a Storefront API token
2. Enable these scopes:
   - `read_products`
   - `read_collections`
   - `read_carts`
   - `write_carts`
   - `read_customer`
3. Add credentials to `.env`

## Troubleshooting

**Components not rendering?**
- Ensure all TypeScript types are imported
- Check Tailwind CSS is loaded

**Shopify API errors?**
- Verify token has correct scopes
- Check store URL format

**Build issues?**
- Clear `node_modules` and reinstall
- Check Node.js version (18+)

## License

MIT

## Support

For Hydrogen documentation: https://hydrogen.shopify.dev
For Shopify API docs: https://shopify.dev/api
