import api from '@/lib/api';

export async function getAllCharacters() {
  try {
    const res = await api.get('/characters');
    return res.data;
  } catch (err: any) {
    console.error('[characterService] Erro ao buscar personagens:', err.message);
    return [];
  }
}