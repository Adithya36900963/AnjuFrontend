import { useState, useEffect, useCallback } from 'react';
import { productImageApi, ProductImageItem } from '../../services/product/productImageApi';

export function useProductImages(productId?: string) {
  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const list = await productImageApi.getImagesByProductId(id);
      setImages(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchImages(productId);
    }
  }, [productId, fetchImages]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!productId) return null;
      try {
        const uploaded = await productImageApi.uploadImage(productId, file);
        setImages((prev) => [...prev, uploaded]);
        return uploaded;
      } catch (err: any) {
        setError(err?.message || 'Upload failed');
        throw err;
      }
    },
    [productId]
  );

  return {
    images,
    loading,
    error,
    uploadImage,
    refreshImages: () => productId && fetchImages(productId),
  };
}

export default useProductImages;
