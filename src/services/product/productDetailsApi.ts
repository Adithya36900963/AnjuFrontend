import apiClient from '../../api/axios';
import { Product } from '../../types';
import { PRODUCTS } from '../../data/products';

export interface ProductDetails {
  id: string;
  description: string;
  specifications: string[];
  careInstructions?: string[];
  materials?: string[];
}

export const productDetailsApi = {
  async getProductDetails(productId: string): Promise<ProductDetails | null> {
    try {
      const response = await apiClient.get<ProductDetails>(`/products/${productId}/details`);
      return response.data;
    } catch {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return null;
      return {
        id: product.id,
        description: product.description,
        specifications: product.details || [],
        careInstructions: [
          'Store in provided protective dust bag',
          'Avoid direct contact with perfumes and water',
          'Wipe with soft microfiber cloth after wear',
        ],
        materials: ['Hypoallergenic materials', '18K Gold Vermeil / Mulberry Silk Charmeuse'],
      };
    }
  },

  async updateProductDetails(productId: string, details: Partial<ProductDetails>): Promise<ProductDetails> {
    try {
      const response = await apiClient.put<ProductDetails>(`/products/${productId}/details`, details);
      return response.data;
    } catch {
      return {
        id: productId,
        description: details.description || '',
        specifications: details.specifications || [],
        careInstructions: details.careInstructions,
        materials: details.materials,
      };
    }
  },
};

export default productDetailsApi;
