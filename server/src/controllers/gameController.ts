// server/src/controllers/gameController.ts
import { Request, Response } from 'express';
import { applyWeeklyLogic, applyProfessionLogic, applyDailyLogic } from '../utils/gameLogic';
import { Resources } from '../types';

export async function nextDay(req: Request, res: Response) {
  const { day, resources }: { day: number; resources: Resources } = req.body;
  console.log(`Advancing to day ${day + 1} with resources:`, resources);
  const newDay = day + 1;
  let updatedResources = applyWeeklyLogic(newDay, resources);
  updatedResources = applyProfessionLogic(newDay, updatedResources);
  updatedResources = applyDailyLogic(newDay, updatedResources);
  // TODO: persist newDay & updatedResources to your PostgreSQL DB here

  return res.json({ day: newDay, resources: updatedResources });
}
