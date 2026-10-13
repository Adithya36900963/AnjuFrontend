import { useState, useEffect, useCallback } from 'react';
import { whishlistApi } from '../../services/whishlist/whishlistApi';
import { Product } from '../../types';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const ids = await whishlistApi.getWishlist();
      setWishlist(ids);
      const prods = await whishlistApi.getWishlistProducts();
      setWishlistProducts(prods);
    } catch (err: any) {
      setError(err?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(async (productId: string) => {
    try {
      const res = await whishlistApi.toggleWishlist(productId);
      setWishlist(res.wishlist);
      const prods = await whishlistApi.getWishlistProducts();
      setWishlistProducts(prods);
      return res.isWishlisted;
    } catch (err: any) {
      setError(err?.message || 'Failed to update wishlist');
      return false;
    }
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  return {
    wishlist,
    wishlistProducts,
    loading,
    error,
    toggleWishlist,
    isWishlisted,
    refreshWishlist: fetchWishlist,
  };
}

export default useWishlist;
