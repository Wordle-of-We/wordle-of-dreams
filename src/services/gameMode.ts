import { apiAdmin, apiUser } from '../lib/api';
import type { GameMode, CreateGameModeDto, UpdateGameModeDto } from '@/interfaces/GameMode';

export const gameModeService = {
  async initialize(): Promise<GameMode[]> {
    const { data } = await apiAdmin.post<GameMode[]>('/game-mode/initialize');
    return data;
  },

  async getAll(): Promise<GameMode[]> {
    const { data } = await apiUser.get<GameMode[]>('/game-mode');
    return data;
  },

  async getById(id: number): Promise<GameMode> {
    const { data } = await apiUser.get<GameMode>(`/game-mode/${id}`);
    return data;
  },

  async create(dto: CreateGameModeDto): Promise<GameMode> {
    const { data } = await apiAdmin.post<GameMode>('/game-mode', dto);
    return data;
  },

  async update(id: number, dto: UpdateGameModeDto): Promise<GameMode> {
    const { data } = await apiAdmin.patch<GameMode>(`/game-mode/${id}`, dto);
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiAdmin.delete(`/game-mode/${id}`);
  },
};
