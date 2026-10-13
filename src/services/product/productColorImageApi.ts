import apiClient from '../../api/axios';
import { PRODUCTS } from '../../data/products';

export interface ProductColorImage {
  id: string;
  colorName: string;
  imageUrl: string;
  angle?: string;
}

export const productColorImageApi = {
  async getColorImages(productId: string, colorName?: string): Promise<ProductColorImage[]> {
    try {
      const response = await apiClient.get<ProductColorImage[]>(`/products/${productId}/color-images`, {
        params: { colorName },
      });
      return response.data;
    } catch {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return [];
      
      const variant = colorName
        ? product.colorVariants?.find((v) => v.name.toLowerCase() === colorName.toLowerCase())
        : product.colorVariants?.[0];

      if (variant?.images?.length) {
        return variant.images.map((img, idx) => ({
          id: `img-${idx}`,
          colorName: variant.name,
          imageUrl: img,
          angle: `View ${idx + 1}`,
        }));
      }

      return (product.images || [product.image]).map((img, idx) => ({
        id: `img-default-${idx}`,
        colorName: 'Primary',
        imageUrl: img,
        angle: `Angle ${idx + 1}`,
      }));
    }
  },
};

export default productColorImageApi;
