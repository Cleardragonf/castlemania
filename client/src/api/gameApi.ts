// client/src/api/gameApi.ts
import api from './axios';
import { Resources } from '@shared/index';

export async function advanceDay(day: number, resources: Resources) {
  const { data } = await api.post('/api/game/next-day', { day, resources });
  return data as { day: number; resources: Resources };
}
