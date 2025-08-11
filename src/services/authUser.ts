import { apiUser } from '../lib/api';
import type { User } from '../interfaces/User';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authUser = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiUser.post<AuthResponse>('/auth/login', { email, password });

    if (typeof window !== 'undefined') {
      localStorage.setItem('userToken', data.accessToken);
      localStorage.setItem('userRefreshToken', data.refreshToken);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userSelf', JSON.stringify(data.user));
    }

    return data;
  },

  async register(payload: { email: string; password: string; username: string }): Promise<User> {
    const { data } = await apiUser.post<User>('/users', payload);
    return data;
  },

  async resendVerification(email: string) {
    const { data } = await apiUser.post<{ message: string }>('/auth/resend-verification', { email });
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await apiUser.get<User>('/auth/profile');
    return data;
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRefreshToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userSelf');
      window.location.href = '/login';
    }
  },
};
