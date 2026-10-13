import { useState, useEffect, useCallback } from 'react';
import { productVariantApi, ProductVariantItem } from '../../services/product/productVariantApi';

export function useProductVariants(productId?: string) {
  const [variants, setVariants] = useState<ProductVariantItem[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await productVariantApi.getVariantsByProductId(id);
      setVariants(data);
      if (data.length > 0) setSelectedVariant(data[0]);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch variants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchVariants(productId);
    }
  }, [productId, fetchVariants]);

  return {
    variants,
    selectedVariant,
    setSelectedVariant,
    loading,
    error,
    refreshVariants: () => productId && fetchVariants(productId),
  };
}

export default useProductVariants;
