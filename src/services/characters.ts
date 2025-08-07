import api from '../lib/api';
import type {
  Character,
  CreateCharacterDto,
  UpdateCharacterDto,
} from '../interfaces/Character';

/** Busca todos os personagens */
export async function getAllCharacters(): Promise<Character[]> {
  const response = await api.get<Character[]>('/characters', {
    withCredentials: true,
  });
  return response.data;
}

/** Busca um personagem pelo ID */
export async function getCharacterById(id: number): Promise<Character> {
  const response = await api.get<Character>(`/characters/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

/** Cria um novo personagem (com upload opcional de arquivo) */
export async function createCharacter(
  data: Omit<CreateCharacterDto, 'file'>,
  file?: File
): Promise<Character> {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('gender', data.gender);
  formData.append('aliveStatus', data.aliveStatus.toString());

  if (data.emojis) {
    formData.append('emojis', JSON.stringify(data.emojis));
  }
  if (data.race) {
    formData.append('race', JSON.stringify(data.race));
  }
  if (data.ethnicity) {
    formData.append('ethnicity', JSON.stringify(data.ethnicity));
  }
  if (data.paper) {
    formData.append('paper', JSON.stringify(data.paper));
  }
  if (data.hair) {
    formData.append('hair', data.hair);
  }
  if (data.imageUrl1) {
    formData.append('imageUrl1', data.imageUrl1);
  }
  if (data.imageUrl2) {
    formData.append('imageUrl2', data.imageUrl2);
  }
  if (data.franchiseIds) {
    formData.append('franchiseIds', JSON.stringify(data.franchiseIds));
  }

  const response = await api.post<Character>('/characters', formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/** Atualiza dados de um personagem */
export async function updateCharacter(
  id: number,
  data: UpdateCharacterDto
): Promise<Character> {
  const response = await api.patch<Character>(
    `/characters/${id}`,
    data,
    { withCredentials: true }
  );
  return response.data;
}

/** Atualiza apenas a imagem de um personagem */
export async function updateCharacterImage(
  id: number,
  file?: File,
  imageUrl1?: string
): Promise<Character> {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  if (imageUrl1) {
    formData.append('imageUrl1', imageUrl1);
  }

  const response = await api.patch<Character>(
    `/characters/${id}/image`,
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
}

/** Remove apenas a imagem de um personagem */
export async function deleteCharacterImage(id: number): Promise<Character> {
  const response = await api.delete<Character>(
    `/characters/${id}/image`,
    { withCredentials: true }
  );
  return response.data;
}

/** Deleta um personagem */
export async function deleteCharacter(id: number): Promise<Character> {
  const response = await api.delete<Character>(
    `/characters/${id}`,
    { withCredentials: true }
  );
  return response.data;
}
