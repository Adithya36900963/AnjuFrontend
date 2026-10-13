import apiClient from '../../api/axios';
import { Product, ProductQueryParams } from '../../types';
import { PRODUCTS } from '../../data/products';

export const productApi = {
  async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/products', { params });
      return response.data?.length ? response.data : PRODUCTS;
    } catch {
      let filtered = [...PRODUCTS];
      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter((p) => p.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categoryLabel.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
      if (params?.sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (params?.sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (params?.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }
      return filtered;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch {
      return PRODUCTS.find((p) => p.id === id) || null;
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/products', product);
      return response.data;
    } catch {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: product.name || 'New Piece',
        category: (product.category as any) || 'accessories',
        categoryLabel: product.categoryLabel || 'Accessories',
        price: product.price || 50,
        rating: 5.0,
        reviewsCount: 1,
        image: product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
        description: product.description || 'Crafted with fine materials.',
        details: product.details || [],
      };
      return newProd;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const response = await apiClient.put<Product>(`/products/${id}`, updates);
      return response.data;
    } catch {
      const existing = PRODUCTS.find((p) => p.id === id);
      if (!existing) return null;
      return { ...existing, ...updates };
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch {
      return true;
    }
  },
};

export default productApi;
