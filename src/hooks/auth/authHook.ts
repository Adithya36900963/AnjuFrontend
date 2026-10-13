import { useState, useEffect, useCallback } from 'react';
import { authApi, LoginRequest, RegisterRequest } from '../../services/auth/authApi';
import { UserProfile } from '../../types';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    authApi
      .getProfile()
      .then((profile) => {
        if (isMounted) setUser(profile);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Failed to load profile');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(data);
      setUser(res.user);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const updated = await authApi.updateProfile(updates);
      setUser(updated);
      return updated;
    } catch (err: any) {
      setError(err?.message || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: Boolean(user),
  };
}

export default useAuth;
