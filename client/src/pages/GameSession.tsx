import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { People } from '../types';
import { advanceDay } from '../api/gameApi';
import { professionList, Profession } from '../types';
import { TechnologyModal } from '../modals/TechnologyModal';
import { useResourceContext } from '../contexts/ResourceContext';
import { GameOverModal } from '../modals/GameOverModal';  // <-- import here
import { Box, Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useHistoryContext } from '../contexts/HistoryContext';

export const GameSession: React.FC = () => {
  const navigate = useNavigate();

  const [day, setDay] = useState(1);
  const [selectedProfession, setSelectedProfession] = useState<Profession>('farmer');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const { history, addEntry } = useHistoryContext();
  const [techOpen, setTechOpen] = useState(false);

  const { resources: loot, setResources: setLoot } = useResourceContext();

  useEffect(() => {
    const entry = `Day ${day}: Food=${loot.loot?.food ?? 0}, People=${Object.values(loot.people ?? {}).reduce((sum, val) => sum + val, 0)}`;
    
    // Only add if it's different from last entry to prevent duplicates from double effect calls
    if (history[history.length - 1] !== entry) {
      addEntry(entry);
    }
    
    setScore(day * 10);
  }, [day, loot, addEntry, history]);


  const handleNextDay = async () => {
    try {
      const { day: newDay, resources: newRes } = await advanceDay(day, loot);

      const totalPeople = newRes.people
        ? Object.values(newRes.people).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0)
        : 0;
      const food = newRes.loot?.food ?? 0;

      setDay(newDay);
      setLoot(newRes);

      if (food <= 0 && totalPeople <= 0) {
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

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>Game Session</Typography>
      <Typography variant="h5" gutterBottom>Day: {day}</Typography>

      <div>
        <Typography variant="h6">Loot:</Typography>
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
        <Typography variant="h6">People:</Typography>
        {loot.people && Object.keys(loot.people).length > 0 ? (
          <ul>
            {Object.entries(loot.people).map(([key, value]) => (
              <li key={key}>
                {key}: {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No people yet.</Typography>
        )}
      </div>

      <Box mt={2} mb={2}>
        <Button variant="outlined" onClick={() => navigate('/home')} sx={{ mr: 2 }}>
          Quit
        </Button>
        <Button variant="contained" onClick={handleNextDay} disabled={gameOver}>
          Next Day
        </Button>
      </Box>

      {loot.people?.citizen && loot.people.citizen > 0 && !gameOver && (
        <Box mt={2} display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="profession-select-label">Convert a Citizen to</InputLabel>
            <Select
              labelId="profession-select-label"
              id="professionSelect"
              value={selectedProfession}
              label="Convert a Citizen to"
              onChange={(e) => setSelectedProfession(e.target.value as Profession)}
            >
              {professionList.map((prof) => (
                <MenuItem key={prof} value={prof}>
                  {prof}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleConvert}>
            Convert
          </Button>

          <Button variant="outlined" onClick={() => setTechOpen(true)}>
            Technology
          </Button>
        </Box>
      )}

      <GameOverModal open={gameOver} day={day} score={score} history={history} />
      <TechnologyModal open={techOpen} onClose={() => setTechOpen(false)} />
    </div>
  );
};

