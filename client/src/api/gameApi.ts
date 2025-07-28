// client/src/api/gameApi.ts
import { TechNode } from '@shared/techTreeData';
import api from './axios';
import { Resources } from '@shared/index';

export async function advanceDay(day: number, resources: Resources, tech: TechNode[]) {
  const { data } = await api.post('/api/game/next-day', { day, resources, tech });
  return data as { day: number; resources: Resources };
}
