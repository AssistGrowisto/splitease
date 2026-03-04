# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Shopify
Create `.env.local` file:
```
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=your_access_token_here
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_access_token_here
SHOPIFY_STOREFRONT_API_VERSION=2024-01
```

**How to get Storefront API token:**
1. Go to Shopify Admin → Apps → App and sales channel settings
2. Create a custom app
3. Under "Admin API access scopes", enable:
   - `read_products`
   - `read_collections`
   - `read_carts`
   - `write_carts`
   - `read_customers`
4. Copy your Storefront API access token

### Step 3: Start Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Testing the Storefront

### Homepage
- Visit `/` to see hero banner, featured collections, categories
- Click on product cards to navigate to product details

### Products
- Visit `/products/product-0` to see PDP with gallery and form
- Try selecting sizes, colors, quantities
- Image gallery has working thumbnails

### Collections
- Visit `/collections/mens` to see collection page
- Use FilterSidebar to filter by category, price, sport
- Use SortDropdown to change product order
- See responsive grid (2 cols mobile, 4 desktop)

### Cart
- Visit `/cart` to see shopping cart page
- Mock cart items are pre-loaded for testing
- Try adjusting quantities and removing items

### Search
- Click search icon in header
- Type a search query
- See search results page with products

## Project Structure Quick Reference

```
app/
├── components/        # 25 reusable React components
├── routes/           # 6 page routes
├── graphql/          # GraphQL queries and fragments
├── lib/              # Utility functions
├── styles/           # Global CSS
├── root.tsx          # Root layout
├── entry.*.tsx       # Entry points
```

## Common Tasks

### Add a New Product Filter
Edit `app/components/collection/FilterSidebar.tsx` - add to `FILTER_GROUPS` array

### Change Brand Colors
Edit `app/tailwind.config.js` - modify color values under `colors`

### Create New Route
Create file in `app/routes/` following Remix conventions

### Customize Components
All components are in `app/components/` - fully documented with TypeScript interfaces

### Add GraphQL Query
Create query file in `app/graphql/` - use fragments from `app/lib/fragments.ts`

## Available Commands

```bash
npm run dev          # Dev server with hot reload
npm run build        # Production build
npm run start        # Run production build
npm run type-check   # TypeScript type checking
npm run lint         # ESLint validation
```

## Component Preview

### Button
```jsx
<Button variant="primary" size="lg">SHOP NOW</Button>
<Button variant="outline" size="md">EXPLORE</Button>
```

### Product Card
```jsx
<ProductCard
  title="Product Name"
  handle="product-slug"
  price="5999"
  image={{ url: "image.jpg" }}
/>
```

### Filter Sidebar
```jsx
<FilterSidebar
  filters={filterGroups}
  selectedFilters={selected}
  onFilterChange={handleChange}
/>
```

## Design System

**Colors (UA Brand)**
- Dark text: `bg-ua-dark` / `text-ua-dark` (#1D1D1D)
- Light text: `bg-ua-light` / `text-ua-light` (#FFFFFF)
- Grey: `text-ua-grey` (#5F5F5F)
- Black: `bg-ua-black` (#000000)

**Typography**
```jsx
<h1 className="text-4xl font-bold text-uppercase">HEADING</h1>
<p className="text-ua-grey">Body text</p>
```

**Spacing**
```jsx
<div className="container-padding section-spacing">
  {/* Container padding + vertical spacing */}
</div>
```

## Responsive Design

Mobile-first breakpoints:
- `sm` (640px)
- `md` (768px)
- `lg` (1024px)
- `xl` (1280px)

Example:
```jsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* 2 cols mobile, 3 tablet, 4 desktop */}
</div>
```

## Deploying

### Cloudflare Pages
```bash
npm run build
wrangler pages publish dist
```

### Vercel
```bash
vercel --prod
```

See README.md for more deployment options.

## Troubleshooting

**Dev server not starting?**
- Clear `node_modules`: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be 18+)

**Components not rendering?**
- Check console for TypeScript errors
- Verify imports are correct

**Styles not applying?**
- Tailwind CSS loads from `app/styles/tailwind.css`
- All styles use Tailwind utilities (no separate CSS files)

**Shopify API errors?**
- Verify token has correct scopes
- Check store URL format
- Ensure environment variables are set

## Next Steps

1. ✓ Install and run locally
2. ✓ Connect your Shopify store
3. ✓ Test all pages and components
4. ✓ Customize colors and branding
5. → Add real product data
6. → Implement checkout flow
7. → Deploy to production

## Resources

- 📖 [Hydrogen Docs](https://hydrogen.shopify.dev)
- 📖 [Remix Docs](https://remix.run/docs)
- 📖 [Shopify API](https://shopify.dev/api)
- 📖 [Tailwind CSS](https://tailwindcss.com)

## Support

For issues and questions:
1. Check Hydrogen documentation
2. Review component comments and TypeScript types
3. Check browser console for errors
4. Verify Shopify API credentials

Happy building! 🚀
