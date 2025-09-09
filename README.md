# Coffee Grind (React + Vite)

Migrated the static homepage to a React (Vite) setup while preserving the existing visual design.

## Scripts

- `npm install`
- `npm run dev` (start development server)
- `npm run build` (production build)
- `npm run preview` (serve production build)

## Architecture

- `index.html` keeps original static header/banner/footer for pixel fidelity.
- React mounts into `#root` and renders dynamic sections (categories, new arrivals, featured products, testimonials, services) using dummy data in `src/data/products.js`.
- Global store (`StoreContext`) manages cart & wishlist counts and progressively updates existing static badge counters.

## Next Steps

1. Extract header/footer/banner into React components if/when full SPA routing is required.
2. Add React Router for multi-page experience (e.g., /cart, /product/:id, /wishlist).
3. Persist cart & wishlist to localStorage.
4. Implement modal for product quick view.
5. Add filtering & search logic wired to search input.

## Dummy Data

Located in `src/data/products.js`.

Enjoy brewing!
