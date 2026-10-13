import apiClient from '../../api/axios';
import { PRODUCTS } from '../../data/products';

export interface ProductSize {
  id: string;
  size: string;
  inStock: boolean;
  quantity?: number;
}

export const sizeApi = {
  async getSizesByProductId(productId: string): Promise<ProductSize[]> {
    try {
      const response = await apiClient.get<ProductSize[]>(`/products/${productId}/sizes`);
      return response.data;
    } catch {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product?.sizes?.length) return [];
      return product.sizes.map((s, idx) => ({
        id: `sz-${idx}`,
        size: s,
        inStock: true,
        quantity: 15,
      }));
    }
  },

  async addSize(productId: string, size: string): Promise<ProductSize> {
    try {
      const response = await apiClient.post<ProductSize>(`/products/${productId}/sizes`, { size });
      return response.data;
    } catch {
      return {
        id: `sz-${Date.now()}`,
        size,
        inStock: true,
      };
    }
  },
};

export default sizeApi;
