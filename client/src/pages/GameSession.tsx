import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { advanceDay } from '../api/gameApi';
import { professionList, Profession, ProfessionDetails, People } from '@shared/index';
import { TechnologyModal } from '../modals/TechnologyModal';
import { useResourceContext } from '../contexts/ResourceContext';
import { GameOverModal } from '../modals/GameOverModal';
import { Box, Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useHistoryContext } from '../contexts/HistoryContext';
import { useTechnologyContext } from '../contexts/TechnologyContext';

export const GameSession: React.FC = () => {
  const navigate = useNavigate();

  // <-- Fix: if professionList is array of ProfessionDetails, selectedProfession is a string matching `name`
  const [day, setDay] = useState(1);
  const [selectedProfession, setSelectedProfession] = useState<string>('farmer');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [techOpen, setTechOpen] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const { resources: loot, setResources: setLoot } = useResourceContext();
  const { history, addEntry } = useHistoryContext();
  const { techTree, resetTechTree } = useTechnologyContext();

  useEffect(() => {
const totalPeople = Object.values(loot.people ?? {}).reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0);

    const entry = `Day ${day}: Food=${loot.loot?.food ?? 0}, People=${totalPeople}`;

    if (history[history.length - 1] !== entry) {
      addEntry(entry);
    }
    handleScoreCalculation();
  }, [day, loot, addEntry, history]);

  

  const handleNextDay = async () => {
    try {
      const { day: newDay, resources: newRes } = await advanceDay(day, loot, techTree);

      // Fix: Safer reduce with default 0
      const totalPeople = Object.values(loot.people ?? {}).reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0);
      const food = newRes.loot?.food ?? 0;

      setDay(newDay);
      setLoot(newRes);

    if ((totalPeople ?? 0) <= 0) {
      handleGameover();      
    }
    } catch (err) {
      console.error(err);
    }
  };

const handleGameover = () => {
  setGameOver(true);
  resetTechTree(); // Reset tech tree on game over
};

const handleConvert = async () => {
  if (!loot.people || (loot.people.citizen ?? 0) < 1) return;

  const prof = selectedProfession as Profession;
  const professionDetails = professionList.find(p => p.name === prof);
  if (!professionDetails) return;

  const currentCoins = loot.loot?.coins ?? 0;
  if (currentCoins < professionDetails.cost) return; // safety guard

  const updatedPeople: People = {
    ...loot.people,
    citizen: (loot.people.citizen ?? 1) - 1,
    [prof]: (loot.people[prof] ?? 0) + 1,
  };

  if (updatedPeople.citizen === 0) {
    delete updatedPeople.citizen;
  }

  const updatedLoot = {
    ...loot,
    loot: {
      ...loot.loot,
      coins: currentCoins - professionDetails.cost,
    },
    people: updatedPeople,
  };

  setLoot(updatedLoot);
};

const handleBreeding = () => {
  if(loot.people?.citizen && loot.people.citizen >= 2) {
    const updatedPeople: People = {
      ...loot.people,
      citizen: (loot.people.citizen ?? 0) + 1, // Add one citizen
    };

    const updatedLoot = {
      ...loot,
      people: updatedPeople,
    };

    setLoot(updatedLoot);
  }
}

const professionValueMap: Record<string, number> = professionList.reduce((map, prof) => {
    map[prof.name.toLowerCase()] = prof.value;
    return map;
  }, {} as Record<string, number>);

  const handleScoreCalculation = () => {
    const weightedTotalPeople = Object.entries(loot.people ?? {}).reduce((sum, [prof, count]) => {
      const profValue = professionValueMap[prof.toLowerCase()] ?? 1; // fallback to 1 if unknown
      return sum + (typeof count === 'number' ? count * profValue : 0);
    }, 0);

    const food = loot.loot?.food ?? 0;

    const newScore = weightedTotalPeople * food + day * 10;
    if (newScore >= highScore) {
      setHighScore(newScore);
    }

    setScore(newScore);
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

      <Box mt={2} mb={2} gap={2} display={'flex'} flexDirection="row">
        <Button variant="outlined" onClick={() => handleGameover()}>
          Quit
        </Button>
        <Button variant="contained" onClick={handleNextDay} disabled={gameOver}>
          Next Day
        </Button>
        <Button variant="outlined" onClick={() => setTechOpen(true)}>
          Technology
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
              onChange={(e) => setSelectedProfession(e.target.value)}
            >
              {professionList.map((prof: ProfessionDetails) => {
                const affordable = (loot.loot?.coins ?? 0) >= prof.cost;

                return (
                  <MenuItem
                    key={prof.name}
                    value={prof.name}
                    disabled={!affordable}
                  >
                    {prof.name} (${prof.cost}) {!affordable && '- Not enough coins'}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box>
            <Button variant="contained" onClick={handleConvert}>
              Convert
            </Button>
            <Typography variant="body2" color="textSecondary">
              {loot.people.citizen} Citizens available
            </Typography>
            {loot.people?.citizen && loot.people.citizen / 2 && loot.loot?.food && loot.loot.food >= 5 && (
              <Button variant="outlined" onClick={handleBreeding} sx={{ ml: 2 }}>
                Breed Citizens
              </Button>
            )}
          </Box>
        </Box>
      )}

      {}

      <GameOverModal open={gameOver} day={day} score={score} history={history} highScore={highScore} />
      <TechnologyModal open={techOpen} onClose={(() => setTechOpen(false))} />
    </div>
  );
};
