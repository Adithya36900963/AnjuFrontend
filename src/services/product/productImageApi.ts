import apiClient from '../../api/axios';
import { PRODUCTS } from '../../data/products';

export interface ProductImageItem {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  altText?: string;
}

export const productImageApi = {
  async getImagesByProductId(productId: string): Promise<ProductImageItem[]> {
    try {
      const response = await apiClient.get<ProductImageItem[]>(`/products/${productId}/images`);
      return response.data;
    } catch {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return [];
      const list = product.images?.length ? product.images : [product.image];
      return list.map((url, idx) => ({
        id: `img-${productId}-${idx}`,
        productId,
        url,
        isPrimary: idx === 0,
        altText: product.name,
      }));
    }
  },

  async uploadImage(productId: string, file: File): Promise<ProductImageItem> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiClient.post<ProductImageItem>(`/products/${productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      return {
        id: `img-up-${Date.now()}`,
        productId,
        url: URL.createObjectURL(file),
        isPrimary: false,
      };
    }
  },
};

export default productImageApi;
