import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {GameSetupModal} from '../components/GameSetupModal';
import { Loot, Resources } from '../types';

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
      <button onClick={handleContinue} style={{ marginRight: '1rem' }}>
        Continue Game
      </button>
      <button onClick={handleStartNew}>Start New Game</button>

      {showModal && (
        <GameSetupModal onLootSelected={handleLootSelected} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

