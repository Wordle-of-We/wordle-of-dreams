import { apiAdmin, apiUser } from '../lib/api';
import type { DailySelection, TodaySelection, TodaySelectionMap } from '../interfaces/DailySelection';

export async function getTodaySelections(
  modeId?: number
): Promise<TodaySelectionMap> {
  const params = modeId !== undefined ? { modeId } : {};
  const { data } = await apiUser.get<TodaySelectionMap>('/daily-selection', {
    params,
    withCredentials: true,
  });
  return data;
}

export async function manualDraw(
  modeConfigId: number
): Promise<DailySelection> {
  const { data } = await apiAdmin.post<DailySelection>(
    '/daily-selection/manual',
    { modeConfigId },
    { withCredentials: true }
  );
  return data;
}

export async function getLatestSelections(
  modeId?: number
): Promise<DailySelection[]> {
  const params = modeId !== undefined ? { modeId } : {};
  const { data } = await apiUser.get<DailySelection[]>('/daily-selection/latest', {
    params,
    withCredentials: true,
  });
  return data;
}

export async function getAllTodayRaw(): Promise<DailySelection[]> {
  const { data } = await apiUser.get<DailySelection[]>('/daily-selection/all-today', {
    withCredentials: true,
  });
  return data;
}

export async function getSelectionByMode(
  modeId: number
): Promise<TodaySelection> {
  const { data } = await apiUser.get<TodaySelection>(
    `/daily-selection/${modeId}`,
    { withCredentials: true }
  );
  return data;
}
