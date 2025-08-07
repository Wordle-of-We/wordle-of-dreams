import { User } from "./User";
import { ChartData } from 'chart.js'


export interface ModeStats {
  modeConfigId: number;
  modeName: string;
  initiatedPlays: number;
  completedPlays: number;
  uncompletedPlays: number;
  averageAttempts: number;
  uniqueUsers: number;
}

export interface TopCharacter {
  character: string
  count: number
}

export interface KPI {
  totalUsers: number
  activeUsers: number
  dailyGames: number
  totalAttempts: number
  topCharacters: Record<string, TopCharacter[]>

  accessData: ChartData<'line', number[], string>
  modeUsageData: ChartData<'pie', number[], string>
  attemptsData: ChartData<'bar', number[], string>
}

export interface DailyOverview {
  date: string;
  totalUsersEver: number;
  totalNewUsers: number;
  totalInitiatedPlays: number;
  totalCompletedPlays: number;
  totalUncompletedPlays: number;
  playsByMode: Record<
    string,
    { initiated: number; completed: number; uncompleted: number }
  >;
}

export interface AccessLog {
  id: string;
  endpoint: string;
  userId?: string;
  user?: User;
  gameMode?: string;
  method: string;
  statusCode: number;
  timestamp: string;
}

