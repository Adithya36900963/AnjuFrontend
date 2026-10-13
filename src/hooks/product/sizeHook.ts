import { useState, useEffect, useCallback } from 'react';
import { sizeApi, ProductSize } from '../../services/product/sizeApi';

export function useSizes(productId?: string) {
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSizes = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await sizeApi.getSizesByProductId(id);
      setSizes(data);
      if (data.length > 0) setSelectedSize(data[0].size);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch sizes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchSizes(productId);
    }
  }, [productId, fetchSizes]);

  return {
    sizes,
    selectedSize,
    setSelectedSize,
    loading,
    error,
    refreshSizes: () => productId && fetchSizes(productId),
  };
}

export default useSizes;
