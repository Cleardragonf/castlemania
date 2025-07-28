// server/src/controllers/gameController.ts
import { Request, Response } from 'express';
import { applyWeeklyLogic, applyProfessionLogic, applyDailyLogic } from '../utils/gameLogic';
import { Resources } from '@shared/index';
import { TechNode } from '@shared/techTreeData';

export async function nextDay(req: Request, res: Response) {
  const { day, resources, tech }: { day: number; resources: Resources; tech: TechNode[] } = req.body;
  console.log(`Advancing to day ${day + 1} with resources:`, resources);
  const newDay = day + 1;
  let updatedResources = applyWeeklyLogic(newDay, resources);
  updatedResources = applyProfessionLogic(newDay, updatedResources, tech);
  // console.log("Testing at Game Controller:", tech);
  updatedResources = applyDailyLogic(newDay, updatedResources, tech);
  // TODO: persist newDay & updatedResources to your PostgreSQL DB here

  return res.json({ day: newDay, resources: updatedResources });
}
