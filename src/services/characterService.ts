import api from '@/lib/api';

export async function getAllCharacters() {
  try {
    const res = await api.get('/characters');
    console.log('[characterService] Lista de personagens:', res.data);
    return res.data;
  } catch (err: any) {
    console.error('[characterService] Erro ao buscar personagens:', err.message);
    return [];
  }
}