import { supabase } from './supabase';
import type { LoginData, ChangePasswordData } from '@shared/schema';
import { apiRequest } from './queryClient';

export const authService = {
  async login(data: LoginData) {
    const response = await apiRequest('POST', '/api/auth/login', data);
    return response.json();
  },

  async logout() {
    await apiRequest('POST', '/api/auth/logout');
  },

  async getCurrentUser() {
    const response = await apiRequest('GET', '/api/auth/me');
    return response.json();
  },

  async changePassword(data: ChangePasswordData) {
    const response = await apiRequest('POST', '/api/auth/change-password', data);
    return response.json();
  },

  async checkAuthStatus() {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        return response.json();
      }
      return null;
    } catch {
      return null;
    }
  }
};
