import { useState, useEffect, useCallback } from 'react';
import { productColorImageApi, ProductColorImage } from '../../services/product/productColorImageApi';

export function useProductColorImages(productId?: string, colorName?: string) {
  const [images, setImages] = useState<ProductColorImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async (pId: string, cName?: string) => {
    setLoading(true);
    try {
      const data = await productColorImageApi.getColorImages(pId, cName);
      setImages(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchImages(productId, colorName);
    }
  }, [productId, colorName, fetchImages]);

  return {
    images,
    loading,
    error,
    fetchImages,
  };
}

export default useProductColorImages;
