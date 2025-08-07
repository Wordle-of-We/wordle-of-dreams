export interface Franchise {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  charactersCount?: number;
}

export interface UpdateFranchiseDto {
  name?: string;
  imageUrl?: string;
}
