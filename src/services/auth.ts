import api from '../lib/api';
import type { User } from '../interfaces/User';

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      '/auth/login',
      { email, password }
    );
    localStorage.setItem('adminToken', data.token);
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  },

  logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/loginAdmin';
  },
};
