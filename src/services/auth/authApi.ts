import apiClient from '../../api/axios';
import { UserProfile } from '../../types';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-1',
  name: 'Elena Vance',
  email: 'elena.vance@lifestyle.com',
  isVip: true,
  tier: 'Gold Tier VIP',
  joinedDate: 'March 2024',
};

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      if (response.data?.token) {
        localStorage.setItem('lune_auth_token', response.data.token);
      }
      return response.data;
    } catch {
      // Fallback for development if backend API endpoint is not yet connected
      const mockToken = 'mock-jwt-token-lune-' + Date.now();
      localStorage.setItem('lune_auth_token', mockToken);
      return {
        token: mockToken,
        user: {
          ...DEFAULT_USER,
          email: credentials.email,
          name: credentials.email.split('@')[0] || DEFAULT_USER.name,
        },
      };
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      if (response.data?.token) {
        localStorage.setItem('lune_auth_token', response.data.token);
      }
      return response.data;
    } catch {
      const mockToken = 'mock-jwt-token-lune-' + Date.now();
      localStorage.setItem('lune_auth_token', mockToken);
      return {
        token: mockToken,
        user: {
          ...DEFAULT_USER,
          name: data.name,
          email: data.email,
        },
      };
    }
  },

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/auth/profile');
      return response.data;
    } catch {
      return DEFAULT_USER;
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>('/auth/profile', updates);
      return response.data;
    } catch {
      return { ...DEFAULT_USER, ...updates };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('lune_auth_token');
    }
  },
};

export default authApi;
