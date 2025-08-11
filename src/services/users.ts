import api from '../lib/api';
import type { User, CreateUserDto, UpdateUserDto } from '../interfaces/User';

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const { data: user } = await api.post<User>('/users', data);
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data: users } = await api.get<User[]>('/users');
  return users;
};

export const getUserById = async (id: number): Promise<User> => {
  const { data: user } = await api.get<User>(`/users/${id}`);
  return user;
};

export const updateUser = async (
  id: number,
  data: UpdateUserDto
): Promise<User> => {
  const { data: user } = await api.patch<User>(`/users/${id}`, data);
  return user;
};

export const deleteUser = async (id: number): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/users/${id}`);
  return data;
};
