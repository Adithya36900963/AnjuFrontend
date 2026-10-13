import { Product, Category, ProductQueryParams } from '../types';
import {
  PRODUCTS as DUMMY_PRODUCTS,
  CATEGORIES as DUMMY_CATEGORIES,
  TRUST_BADGES as DUMMY_TRUST_BADGES,
  HERO_IMAGE,
  EDITORIAL_PORTRAIT_IMAGE,
  TEAL_HANDBAG_IMAGE,
  DESIGNER_SUNGLASSES_IMAGE,
  MINIMAL_WATCH_IMAGE,
} from '../data/products';

/**
 * Product Service Layer
 * ---------------------
 * Architecture:
 * UI Components
 *   ↓
 * Hooks / Context (useShop, useProducts)
 *   ↓
 * Product Service (productService)
 *   ↓
 * Future REST/GraphQL API Backend (e.g., fetch('/api/v1/products'))
 *
 * Current State:
 * Uses dummy data isolated in `src/data/products.ts`.
 * When a real backend API is connected, only this service file needs to point
 * to fetch('/api/v1/...') or an Axios instance without modifying any UI components.
 */

// Simulated network latency (in ms) to ensure UI handles asynchronous states gracefully
const SIMULATED_LATENCY_MS = 0;

function delay(ms: number) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const productService = {
  /**
   * Fetch all products with optional filtering, search, and sorting.
   * Target Backend Endpoint: GET /api/v1/products
   */
  async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    await delay(SIMULATED_LATENCY_MS);
    let results = [...DUMMY_PRODUCTS];

    if (params?.category && params.category !== 'all') {
      results = results.filter((p) => p.category === params.category);
    }

    if (params?.search && params.search.trim().length > 0) {
      const q = params.search.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (params?.minPrice !== undefined) {
      results = results.filter((p) => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'featured':
        default:
          break;
      }
    }

    if (params?.offset !== undefined || params?.limit !== undefined) {
      const offset = params.offset || 0;
      const limit = params.limit ? offset + params.limit : undefined;
      results = results.slice(offset, limit);
    }

    return results;
  },

  /**
   * Fetch a single product by ID.
   * Target Backend Endpoint: GET /api/v1/products/:id
   */
  async getProductById(id: string): Promise<Product | null> {
    await delay(SIMULATED_LATENCY_MS);
    const found = DUMMY_PRODUCTS.find((p) => p.id === id);
    return found ? { ...found } : null;
  },

  /**
   * Fetch product categories.
   * Target Backend Endpoint: GET /api/v1/categories
   */
  async getCategories(): Promise<Category[]> {
    await delay(SIMULATED_LATENCY_MS);
    return [...DUMMY_CATEGORIES];
  },

  /**
   * Fetch featured / bestseller products for highlights and hero showcases.
   * Target Backend Endpoint: GET /api/v1/products/featured
   */
  async getFeaturedProducts(): Promise<Product[]> {
    await delay(SIMULATED_LATENCY_MS);
    return DUMMY_PRODUCTS.filter((p) => p.isBestSeller || p.badge === 'Best Seller');
  },

  /**
   * Fetch weekly top seller products.
   * Target Backend Endpoint: GET /api/v1/products/top-sellers
   */
  async getTopSellers(): Promise<Product[]> {
    await delay(SIMULATED_LATENCY_MS);
    // Return top rated items
    return [...DUMMY_PRODUCTS].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 8);
  },

  /**
   * Fetch dress apparel products specifically.
   * Target Backend Endpoint: GET /api/v1/products?category=dresses
   */
  async getDresses(): Promise<Product[]> {
    await delay(SIMULATED_LATENCY_MS);
    return DUMMY_PRODUCTS.filter((p) => p.category === 'dresses');
  },

  /**
   * Fetch curated style recommendations based on vibe and occasion.
   * Target Backend Endpoint: POST /api/v1/recommendations/style
   */
  async getStyleRecommendations(vibe: string, occasion: string): Promise<Product[]> {
    await delay(SIMULATED_LATENCY_MS);

    if (vibe === 'statement') {
      return DUMMY_PRODUCTS.filter((p) => p.category === 'jewellery' || p.category === 'dresses' || p.badge === 'Couture').slice(0, 3);
    }
    if (occasion === 'evening') {
      return DUMMY_PRODUCTS.filter((p) => p.category === 'dresses' || p.category === 'watches' || p.category === 'bags').slice(0, 3);
    }
    return DUMMY_PRODUCTS.slice(0, 3);
  },

  /**
   * Fetch trust badges & value propositions.
   * Target Backend Endpoint: GET /api/v1/store/trust-badges
   */
  async getTrustBadges(): Promise<Array<{ icon: string; title: string; desc: string }>> {
    await delay(SIMULATED_LATENCY_MS);
    return [...DUMMY_TRUST_BADGES];
  },

  /**
   * Fetch core brand imagery & marketing assets.
   * Target Backend Endpoint: GET /api/v1/store/branding
   */
  async getBrandAssets() {
    await delay(SIMULATED_LATENCY_MS);
    return {
      heroImage: HERO_IMAGE,
      editorialImage: EDITORIAL_PORTRAIT_IMAGE,
      tealHandbagImage: TEAL_HANDBAG_IMAGE,
      designerSunglassesImage: DESIGNER_SUNGLASSES_IMAGE,
      minimalWatchImage: MINIMAL_WATCH_IMAGE,
    };
  },
};
