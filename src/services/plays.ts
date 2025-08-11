import { apiUser } from '../lib/api';

import type {
  GuessResult,
  StartPlayDto,
  StartPlayResponse,
  DailyProgressResponse,
  PlayProgressResponse,
} from '@/interfaces/Play';

export const startPlay = async (
  data: StartPlayDto
): Promise<StartPlayResponse> => {
  const { data: response } = await apiUser.post<StartPlayResponse>('/plays/start', data);
  return response;
};

export const makeGuess = async (
  playId: number,
  guess: string
): Promise<GuessResult> => {
  const { data } = await apiUser.post<GuessResult>(`/plays/${playId}/guess`, { guess });
  return data;
};

export const getAttemptsByPlay = async (
  playId: number
): Promise<GuessResult[]> => {
  const { data } = await apiUser.get<GuessResult[]>(`/plays/${playId}/attempts`);
  return data;
};

export const getDailyProgress = async (
  modeConfigId: number
): Promise<DailyProgressResponse> => {
  const { data } = await apiUser.get<DailyProgressResponse>(`/plays/progress/${modeConfigId}`);
  return data;
};

export const getPlayProgress = async (
  playId: number
): Promise<PlayProgressResponse> => {
  const { data } = await apiUser.get<PlayProgressResponse>(`/plays/${playId}/progress`);
  return data;
};

export type {
  GuessResult,
  StartPlayDto,
  StartPlayResponse,
  DailyProgressResponse,
  PlayProgressResponse,
} from '@/interfaces/Play';
