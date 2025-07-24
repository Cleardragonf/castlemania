import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {GameSetupModal} from '../modals/GameSetupModal';
import { Loot, Resources } from '@shared/index';
import { Button } from '@mui/material';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleContinue = () => {
    // Later: load game from backend with userId
    navigate('/game');
  };

  const handleStartNew = () => {
    setShowModal(true);
  };

  const handleLootSelected = (selectedLoot: Resources) => {
    localStorage.setItem('startingLoot', JSON.stringify(selectedLoot));
    setShowModal(false);
    navigate('/game');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome Back</h1>

      <Button onClick={handleContinue} variant="contained" color="primary" style={{ marginRight: '1rem' }}>
        Continue Game
      </Button>
      <Button onClick={handleStartNew} variant="contained" color="primary">
        Start New Game
      </Button>

      {showModal && (
        <GameSetupModal onLootSelected={handleLootSelected} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

