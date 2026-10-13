import apiClient from '../../api/axios';
import { Product } from '../../types';
import { PRODUCTS } from '../../data/products';

const WISHLIST_STORAGE_KEY = 'lune_wishlist_ids_v2';

function getStoredWishlistIds(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['prod-4'];
  } catch {
    return ['prod-4'];
  }
}

function saveStoredWishlistIds(ids: string[]) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export const whishlistApi = {
  async getWishlist(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/wishlist');
      return response.data?.length ? response.data : getStoredWishlistIds();
    } catch {
      return getStoredWishlistIds();
    }
  },

  async getWishlistProducts(): Promise<Product[]> {
    const ids = await this.getWishlist();
    return PRODUCTS.filter((p) => ids.includes(p.id));
  },

  async addToWishlist(productId: string): Promise<string[]> {
    try {
      const response = await apiClient.post<string[]>('/wishlist', { productId });
      return response.data;
    } catch {
      const current = getStoredWishlistIds();
      if (!current.includes(productId)) {
        current.push(productId);
        saveStoredWishlistIds(current);
      }
      return current;
    }
  },

  async removeFromWishlist(productId: string): Promise<string[]> {
    try {
      const response = await apiClient.delete<string[]>(`/wishlist/${productId}`);
      return response.data;
    } catch {
      const current = getStoredWishlistIds().filter((id) => id !== productId);
      saveStoredWishlistIds(current);
      return current;
    }
  },

  async toggleWishlist(productId: string): Promise<{ wishlist: string[]; isWishlisted: boolean }> {
    const current = getStoredWishlistIds();
    const exists = current.includes(productId);
    if (exists) {
      const updated = await this.removeFromWishlist(productId);
      return { wishlist: updated, isWishlisted: false };
    } else {
      const updated = await this.addToWishlist(productId);
      return { wishlist: updated, isWishlisted: true };
    }
  },
};

export default whishlistApi;
