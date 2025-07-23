import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { People } from '../types';
import { advanceDay } from '../api/gameApi';
import { professionList, Profession } from '../types';
import { TechnologyModal } from '../components/TechnologyModal';
import { useResourceContext } from '../contexts/ResourceContext';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';

export const GameSession: React.FC = () => {
  const navigate = useNavigate();

  const [day, setDay] = useState(1);
  const [selectedProfession, setSelectedProfession] = useState<Profession>('farmer');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [techOpen, setTechOpen] = useState(false);

  const { resources: loot, setResources: setLoot } = useResourceContext();

  useEffect(() => {
    const entry = `Day ${day}: Food=${loot.loot?.food ?? 0}, People=${Object.values(loot.people ?? {}).reduce((sum, val) => sum + val, 0)}`;
    setHistory((prev) => [...prev, entry]);
    setScore(day * 10);
  }, [day]);

  const handleNextDay = async () => {
    try {
      const { day: newDay, resources: newRes } = await advanceDay(day, loot);

      console.log("People object:", newRes.people);
      const totalPeople = newRes.people
        ? Object.values(newRes.people).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0)
        : 0;
      const food = newRes.loot?.food ?? 0;

      console.log('Day:', newDay, 'Food:', food, 'Total People:', totalPeople);

      setDay(newDay);
      setLoot(newRes);

      if (food <= 0 && totalPeople <= 0) {
        console.log('Game Over condition met!');
        setGameOver(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvert = () => {
    if (!loot.people || (loot.people.citizen ?? 0) < 1) return;

    const prof = selectedProfession as keyof People;

    const updatedPeople: People = {
      ...loot.people,
      citizen: (loot.people.citizen ?? 1) - 1,
      [prof]: (loot.people[prof] ?? 0) + 1,
    };

    if (updatedPeople.citizen === 0) {
      delete updatedPeople.citizen;
    }

    const updatedLoot = { ...loot, people: updatedPeople };
    setLoot(updatedLoot);
  };

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Game Session</h1>
      <h2>Day: {day}</h2>

      <div>
        <h3>Loot:</h3>
        <ul>
          {loot.loot &&
            Object.entries(loot.loot).map(([key, value]) => (
              <li key={key}>
                {key}: {String(value)}
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h3>People:</h3>
        {loot.people && Object.keys(loot.people).length > 0 ? (
          <ul>
            {Object.entries(loot.people).map(([key, value]) => (
              <li key={key}>
                {key}: {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No people yet.</p>
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleNextDay} disabled={gameOver}>Next Day</button>

        {loot.people?.citizen && loot.people.citizen > 0 && !gameOver && (
          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="professionSelect">Convert a Citizen to: </label>
            <select
              id="professionSelect"
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value as Profession)}
            >
              {professionList.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>

            <button style={{ marginLeft: '1rem' }} onClick={handleConvert}>
              Convert
            </button>
            <button onClick={() => setTechOpen(true)}>Technology</button>
          </div>
        )}
      </div>

      <Modal
        open={gameOver}
        onClose={() => {}}
        aria-labelledby="game-over-title"
        aria-describedby="game-over-description"
        disableEscapeKeyDown
      >
        <Box sx={style}>
          <Typography id="game-over-title" variant="h5" component="h2" color="error" textAlign="center" gutterBottom>
            Game Over
          </Typography>
          <Typography textAlign="center" mb={2}>
            You survived <strong>{day}</strong> days.
          </Typography>
          <Typography textAlign="center" mb={4}>
            Score: <strong>{score}</strong>
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Detailed History:
          </Typography>
          <Box
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: 1,
              p: 1,
              mb: 2,
              fontSize: '0.875rem',
            }}
          >
            {history.map((entry, index) => (
              <Typography key={index} sx={{ borderBottom: '1px solid #eee', py: 0.5 }}>
                {entry}
              </Typography>
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/home')} 
          >
            Restart Game
          </Button>
        </Box>
      </Modal>

      <TechnologyModal open={techOpen} onClose={() => setTechOpen(false)} />
    </div>
  );
};
