import { Character } from "./Character"
import { GameMode } from "./GameMode"

export interface TodaySelection {
  modeConfigId: number
  character: Character
}

export type TodaySelectionMap = Record<string, TodaySelection>

export interface DailySelection {
  id: number
  date: string
  latest: boolean
  character: Character
  modeConfig: GameMode
}