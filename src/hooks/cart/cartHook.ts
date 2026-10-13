import { useState, useEffect, useCallback, useMemo } from 'react';
import { cartApi } from '../../services/cart/cartApi';
import { CartItem, Product } from '../../types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const items = await cartApi.getCart();
      setCart(items);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (
      product: Product,
      quantity = 1,
      selectedColor?: string,
      selectedSize?: string,
      selectedVariantImage?: string
    ) => {
      try {
        const item: CartItem = {
          product,
          quantity,
          selectedColor,
          selectedSize,
          selectedVariantImage,
        };
        const updated = await cartApi.addToCart(item);
        setCart(updated);
      } catch (err: any) {
        setError(err?.message || 'Failed to add item to cart');
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
      try {
        const updated = await cartApi.updateQuantity(productId, quantity, selectedColor, selectedSize);
        setCart(updated);
      } catch (err: any) {
        setError(err?.message || 'Failed to update quantity');
      }
    },
    []
  );

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      const updated = await cartApi.removeFromCart(productId);
      setCart(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to remove from cart');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clearCart();
      setCart([]);
    } catch (err: any) {
      setError(err?.message || 'Failed to clear cart');
    }
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  return {
    cart,
    loading,
    error,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };
}

export default useCart;
