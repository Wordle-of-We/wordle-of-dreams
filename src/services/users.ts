import { apiAdmin, apiUser } from '../lib/api';
import type { User, CreateUserDto, UpdateUserDto } from '../interfaces/User';

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const { data: user } = await apiUser.post<User>('/users', data, {
    withCredentials: true,
  });
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data: users } = await apiAdmin.get<User[]>('/users', {
    withCredentials: true,
  });
  return users;
};

export const getUserById = async (id: number): Promise<User> => {
  const { data: user } = await apiAdmin.get<User>(`/users/${id}`, {
    withCredentials: true,
  });
  return user;
};

export const updateUser = async (
  id: number,
  data: UpdateUserDto
): Promise<User> => {
  const { data: user } = await apiAdmin.patch<User>(`/users/${id}`, data, {
    withCredentials: true,
  });
  return user;
};

export const deleteUser = async (id: number): Promise<{ message: string }> => {
  const { data } = await apiAdmin.delete<{ message: string }>(`/users/${id}`, {
    withCredentials: true,
  });
  return data;
};
