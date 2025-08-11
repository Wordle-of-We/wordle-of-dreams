import { apiAdmin } from '../lib/api';
import type { User } from '../interfaces/User';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authAdmin = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiAdmin.post<AuthResponse>('/auth/login-admin', { email, password });

    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', data.accessToken);
      localStorage.setItem('adminRefreshToken', data.refreshToken);
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
    }

    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await apiAdmin.get<User>('/auth/profile');
    return data;
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminUser');
      window.location.href = '/loginAdmin';
    }
  },
};
