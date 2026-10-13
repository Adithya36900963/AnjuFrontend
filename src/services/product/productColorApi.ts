import apiClient from '../../api/axios';
import { PRODUCTS } from '../../data/products';

export interface ProductColor {
  id: string;
  productId: string;
  colorName: string;
  colorHex: string;
  imageUrl?: string;
}

export const productColorApi = {
  async getColorsByProductId(productId: string): Promise<ProductColor[]> {
    try {
      const response = await apiClient.get<ProductColor[]>(`/products/${productId}/colors`);
      return response.data;
    } catch {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product?.colorVariants?.length) {
        return (product?.colors || []).map((hex, idx) => ({
          id: `col-${idx}`,
          productId,
          colorName: `Color ${idx + 1}`,
          colorHex: hex,
        }));
      }
      return product.colorVariants.map((cv, idx) => ({
        id: `var-col-${idx}`,
        productId,
        colorName: cv.name,
        colorHex: cv.colorHex || '#0284c7',
        imageUrl: cv.image,
      }));
    }
  },

  async addColor(productId: string, color: Omit<ProductColor, 'id' | 'productId'>): Promise<ProductColor> {
    try {
      const response = await apiClient.post<ProductColor>(`/products/${productId}/colors`, color);
      return response.data;
    } catch {
      return {
        id: `col-${Date.now()}`,
        productId,
        ...color,
      };
    }
  },
};

export default productColorApi;
