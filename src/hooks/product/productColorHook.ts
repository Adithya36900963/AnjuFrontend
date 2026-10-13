import { useState, useEffect, useCallback } from 'react';
import { productColorApi, ProductColor } from '../../services/product/productColorApi';

export function useProductColors(productId?: string) {
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColors = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await productColorApi.getColorsByProductId(id);
      setColors(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch colors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchColors(productId);
    }
  }, [productId, fetchColors]);

  return {
    colors,
    loading,
    error,
    fetchColors,
  };
}

export default useProductColors;
