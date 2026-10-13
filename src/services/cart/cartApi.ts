import apiClient from '../../api/axios';
import { CartItem } from '../../types';

const CART_STORAGE_KEY = 'lune_cart_items_v2';

function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredCart(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

export const cartApi = {
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await apiClient.get<CartItem[]>('/cart');
      return response.data?.length ? response.data : getStoredCart();
    } catch {
      return getStoredCart();
    }
  },

  async addToCart(item: CartItem): Promise<CartItem[]> {
    try {
      const response = await apiClient.post<CartItem[]>('/cart/items', item);
      return response.data;
    } catch {
      const cart = getStoredCart();
      const existing = cart.find(
        (i) =>
          i.product.id === item.product.id &&
          i.selectedColor === item.selectedColor &&
          i.selectedSize === item.selectedSize
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.push(item);
      }
      saveStoredCart(cart);
      return cart;
    }
  },

  async updateQuantity(productId: string, quantity: number, selectedColor?: string, selectedSize?: string): Promise<CartItem[]> {
    try {
      const response = await apiClient.put<CartItem[]>(`/cart/items/${productId}`, {
        quantity,
        selectedColor,
        selectedSize,
      });
      return response.data;
    } catch {
      let cart = getStoredCart();
      if (quantity <= 0) {
        cart = cart.filter(
          (i) =>
            !(
              i.product.id === productId &&
              (!selectedColor || i.selectedColor === selectedColor) &&
              (!selectedSize || i.selectedSize === selectedSize)
            )
        );
      } else {
        const item = cart.find(
          (i) =>
            i.product.id === productId &&
            (!selectedColor || i.selectedColor === selectedColor) &&
            (!selectedSize || i.selectedSize === selectedSize)
        );
        if (item) item.quantity = quantity;
      }
      saveStoredCart(cart);
      return cart;
    }
  },

  async removeFromCart(productId: string): Promise<CartItem[]> {
    try {
      const response = await apiClient.delete<CartItem[]>(`/cart/items/${productId}`);
      return response.data;
    } catch {
      const cart = getStoredCart().filter((i) => i.product.id !== productId);
      saveStoredCart(cart);
      return cart;
    }
  },

  async clearCart(): Promise<void> {
    try {
      await apiClient.delete('/cart');
    } catch {
      // Local fallback
    } finally {
      saveStoredCart([]);
    }
  },
};

export default cartApi;
