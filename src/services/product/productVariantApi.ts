import apiClient from '../../api/axios';
import { ProductVariant } from '../../types';
import { PRODUCTS } from '../../data/products';

export interface ProductVariantItem {
  id: string;
  productId: string;
  name: string;
  colorHex?: string;
  image: string;
  images?: string[];
  stock?: number;
}

export const productVariantApi = {
  async getVariantsByProductId(productId: string): Promise<ProductVariantItem[]> {
    try {
      const response = await apiClient.get<ProductVariantItem[]>(`/products/${productId}/variants`);
      return response.data;
    } catch {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product?.colorVariants?.length) return [];
      return product.colorVariants.map((v, idx) => ({
        id: `var-${productId}-${idx}`,
        productId,
        name: v.name,
        colorHex: v.colorHex,
        image: v.image,
        images: v.images,
        stock: 25,
      }));
    }
  },

  async addVariant(productId: string, variant: Omit<ProductVariantItem, 'id' | 'productId'>): Promise<ProductVariantItem> {
    try {
      const response = await apiClient.post<ProductVariantItem>(`/products/${productId}/variants`, variant);
      return response.data;
    } catch {
      return {
        id: `var-${Date.now()}`,
        productId,
        ...variant,
      };
    }
  },
};

export default productVariantApi;
