import { apiUser } from '../lib/api';

export type StartPlayResponse = {
  playId: number;
  completed: boolean;
  attemptsCount: number;
  character: {
    id: number; name: string; description: string;
    imageUrl1: string | null; imageUrl2: string | null; emojis?: string[] | null;
  };
  modeConfig: {
    id: number; name: string;
    imageUseSecondImage?: boolean; imageBlurStart?: number;
    imageBlurStep?: number; imageBlurMin?: number;
  };
  guestId?: string;
};

export async function startPlay(modeConfigId: number, date?: string) {
  const { data } = await apiUser.post<StartPlayResponse>('/plays/start', { modeConfigId, date });
  if (data.guestId) localStorage.setItem('guestId', data.guestId);
  return data;
}

export async function getDailyProgress(modeConfigId: number) {
  const { data } = await apiUser.get(`/plays/progress/${modeConfigId}`);
  return data;
}

export async function makeGuess(playId: number, guess: string) {
  const { data } = await apiUser.post(`/plays/${playId}/guess`, { guess });
  return data;
}

export async function getAttempts(playId: number) {
  const { data } = await apiUser.get(`/plays/${playId}/attempts`);
  return data;
}
