import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../../services/product/productApi';
import { Product, ProductQueryParams } from '../../types';

export function useProducts(initialParams?: ProductQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (params?: ProductQueryParams) => {
    setLoading(true);
    try {
      const data = await productApi.getProducts(params || initialParams);
      setProducts(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
  };
}

export function useProduct(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(productId));
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await productApi.getProductById(id);
      setProduct(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: () => productId && fetchProduct(productId),
  };
}

export default useProducts;
