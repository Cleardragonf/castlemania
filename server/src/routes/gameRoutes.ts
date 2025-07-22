// server/src/routes/gameRoutes.ts
import { Router } from 'express';
import { nextDay } from '../controllers/gameController';

const router = Router();

// POST /api/game/next-day
router.post('/next-day', nextDay);

export default router;
