import { useState, useEffect, useCallback } from 'react';
import { productDetailsApi, ProductDetails } from '../../services/product/productDetailsApi';

export function useProductDetails(productId?: string) {
  const [details, setDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await productDetailsApi.getProductDetails(id);
      setDetails(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchDetails(productId);
    }
  }, [productId, fetchDetails]);

  return {
    details,
    loading,
    error,
    refreshDetails: () => productId && fetchDetails(productId),
  };
}

// Alias to support the exact filename spelling from user's bundle
export const useProductSetails = useProductDetails;
export default useProductDetails;
