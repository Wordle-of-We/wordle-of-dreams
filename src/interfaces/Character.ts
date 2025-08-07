import { Franchise } from "./Franchise";

export interface Character {
  id: string;
  name: string;
  description: string;
  emojis: string[];
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  race: string[];
  ethnicity: string[];
  hair: string;
  aliveStatus: 'ALIVE' | 'DEAD';
  paper: string[];

  imageUrl1?: string;
  imageUrl2?: string;

  franchises: { id: number; name: string }[]
  franchiseNames: string[]

  file1?: File;
  file2?: File;
  imageUrl1Input?: string;
  imageUrl2Input?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterDto {
  name: string
  description: string
  emojis?: string[]
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  race?: string[]
  ethnicity?: string[]
  hair: string
  aliveStatus: 'ALIVE' | 'DEAD' | 'UNKNOWN'
  paper?: string[]
  imageUrl1?: string
  imageUrl2?: string
  franchiseIds?: string[]
}

export interface UpdateCharacterDto {
  name?: string;
  description?: string;
  emojis?: string[];
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  race?: string[];
  ethnicity?: string[];
  hair?: string;
  aliveStatus?: 'ALIVE' | 'DEAD' | 'UNKNOWN';
  paper?: string[];

  imageUrl1?: string;
  imageUrl2?: string;

  file1?: File;
  file2?: File;
  imageUrl1Input?: string;
  imageUrl2Input?: string;

  franchiseId?: string;
  franchise?: Franchise;
}
