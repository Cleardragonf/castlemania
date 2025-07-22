import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/gameRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// All game-related endpoints under /api/game
app.use('/api/game', gameRoutes);

app.get('/', (_, res) => {
  res.send('Backend is working!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
