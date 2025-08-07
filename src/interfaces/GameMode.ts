export interface GameMode {
  id: number
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateGameModeDto {
  name: string
  description: string
  isActive: boolean
}

export interface UpdateGameModeDto {
  name?: string
  description?: string
  isActive?: boolean
}
