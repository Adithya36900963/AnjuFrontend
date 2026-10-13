import apiClient from '../../api/axios';
import { Category } from '../../types';
import { CATEGORIES } from '../../data/products';

export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/categories');
      return response.data?.length ? response.data : CATEGORIES;
    } catch {
      return [...CATEGORIES];
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    } catch {
      return CATEGORIES.find((c) => c.id === id) || null;
    }
  },

  async createCategory(category: Omit<Category, 'itemCount'>): Promise<Category> {
    try {
      const response = await apiClient.post<Category>('/categories', category);
      return response.data;
    } catch {
      return { ...category, itemCount: 0 };
    }
  },
};

export default categoryApi;
