import { apiAdmin } from '../lib/api';
import type { DailyOverview, ModeStats } from '../interfaces/Stats';

export const statsService = {
  async getDailyOverview(date?: string): Promise<DailyOverview> {
    const res = await apiAdmin.get<DailyOverview>('/stats/overview', {
      params: { date },
      withCredentials: true,
    });
    return res.data;
  },

  async getModeStats(modeId: number, date?: string): Promise<ModeStats> {
    const res = await apiAdmin.get<ModeStats>(`/stats/mode/${modeId}`, {
      params: { date },
      withCredentials: true,
    });
    return res.data;
  },
};
