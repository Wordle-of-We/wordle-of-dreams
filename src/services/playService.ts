import api from '@/lib/api';

export async function getDailyProgress(modeId: number) {
  try {
    const res = await api.get(`/plays/progress/${modeId}`);
    return res.data;
  } catch (err: any) {
    console.error('[playService] Erro ao buscar progresso diário:', err.message);
    return null;
  }
}
