import api from '../lib/api';
import type {
  Character,
  CreateCharacterDto,
  UpdateCharacterDto,
} from '../interfaces/Character';

export async function getAllCharacters(): Promise<Character[]> {
  const { data } = await api.get<Character[]>('/characters', {
    withCredentials: true,
  });
  return data;
}

export async function getCharacterById(id: number): Promise<Character> {
  const { data } = await api.get<Character>(`/characters/${id}`, {
    withCredentials: true,
  });
  return data;
}

export async function createCharacter(
  data: Omit<CreateCharacterDto, 'file'>,
  file?: File
): Promise<Character> {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  formData.append('name', data.name);
  formData.append('description', data.description ?? '');
  formData.append('gender', data.gender);
  formData.append('aliveStatus', data.aliveStatus.toString());
  if (data.hair) formData.append('hair', data.hair);
  if (data.emojis) formData.append('emojis', JSON.stringify(data.emojis));
  if (data.race) formData.append('race', JSON.stringify(data.race));
  if (data.ethnicity) formData.append('ethnicity', JSON.stringify(data.ethnicity));
  if (data.paper) formData.append('paper', JSON.stringify(data.paper));
  if (data.franchiseIds) formData.append('franchiseIds', JSON.stringify(data.franchiseIds));
  if (data.imageUrl1) formData.append('imageUrl1', data.imageUrl1);

  const { data: created } = await api.post<Character>('/characters', formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return created;
}

export async function updateCharacter(
  id: number,
  data: UpdateCharacterDto
): Promise<Character> {
  const { imageUrl1: _ignore1, imageUrl2: _ignore2, ...rest } = data as any;

  const { data: updated } = await api.patch<Character>(
    `/characters/${id}`,
    rest,
    { withCredentials: true }
  );
  return updated;
}

export async function updateCharacterImage(
  id: number,
  file?: File,
  imageUrl1?: string
): Promise<Character> {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (imageUrl1) formData.append('imageUrl1', imageUrl1);

  const { data } = await api.patch<Character>(
    `/characters/${id}/image`,
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
}

export async function deleteCharacterImage(id: number): Promise<Character> {
  const { data } = await api.delete<Character>(`/characters/${id}/image`, {
    withCredentials: true,
  });
  return data;
}

export async function updateCharacterImage2(
  id: number,
  file?: File,
  imageUrl2?: string
): Promise<Character> {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (imageUrl2) formData.append('imageUrl2', imageUrl2);

  const { data } = await api.patch<Character>(
    `/characters/${id}/image2`,
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
}

export async function deleteCharacterImage2(id: number): Promise<Character> {
  const { data } = await api.delete<Character>(`/characters/${id}/image2`, {
    withCredentials: true,
  });
  return data;
}

export async function deleteCharacter(id: number): Promise<Character> {
  const { data } = await api.delete<Character>(`/characters/${id}`, {
    withCredentials: true,
  });
  return data;
}
