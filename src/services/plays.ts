import api from '../lib/api';

import type {
  GuessResult,
  StartPlayDto,
  StartPlayResponse,
  DailyProgressResponse,
  PlayProgressResponse,
} from '@/interfaces/Play';

// Inicia ou recupera a partida do dia
export const startPlay = async (
  data: StartPlayDto
): Promise<StartPlayResponse> => {
  const { data: response } = await api.post<StartPlayResponse>(
    '/plays/start',
    data
  );
  return response;
};

// Envia um palpite
export const makeGuess = async (
  playId: number,
  guess: string
): Promise<GuessResult> => {
  const { data } = await api.post<GuessResult>(`/plays/${playId}/guess`, {
    guess,
  });
  return data;
};

// Lista todos os palpites de uma partida
export const getAttemptsByPlay = async (
  playId: number
): Promise<GuessResult[]> => {
  const { data } = await api.get<GuessResult[]>(
    `/plays/${playId}/attempts`
  );
  return data;
};

// Verifica progresso diário (já jogou hoje?)
export const getDailyProgress = async (
  modeConfigId: number
): Promise<DailyProgressResponse> => {
  const { data } = await api.get<DailyProgressResponse>(
    `/plays/progress/${modeConfigId}`
  );
  return data;
};

// Busca progresso completo de uma partida específica
export const getPlayProgress = async (
  playId: number
): Promise<PlayProgressResponse> => {
  const { data } = await api.get<PlayProgressResponse>(
    `/plays/${playId}/progress`
  );
  return data;
};

export type {
  GuessResult,
  StartPlayDto,
  StartPlayResponse,
  DailyProgressResponse,
  PlayProgressResponse,
} from '@/interfaces/Play';
