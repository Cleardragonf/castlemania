// client/src/components/GameSetupModal.tsx

import React from 'react';
import { Resources } from '../types';

interface LootOption {
  name: string;
  resources: Resources;
}

const lootOptions: LootOption[] = [
  {name: "Lords Package", resources: { loot: { coins: 8, food: 2 }, people: {citizen: 1, farmer: 2} }},
  {name: "Merchants Package", resources: { loot: { coins: 4, food: 4 }, people: {citizen: 2, merchant: 1} }},
  {name: "Warlords Package", resources: { loot: { coins: 2, food: 6 }, people: {citizen: 2, Warrior: 2} }},
  {name: "Commoners Package", resources: { loot: { coins: 1, food: 8 }, people: {citizen: 4, } }},
];

interface Props {
  onLootSelected: (loot: Resources) => void;
  onClose: () => void;
}

export const GameSetupModal: React.FC<Props> = ({ onLootSelected, onClose }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', background: '#f9f9f9' }}>
      <h2>Select Starting Loot</h2>
      <ul>
        {lootOptions.map(option => (
          <li key={option.name}>
            <button onClick={() => onLootSelected(option.resources)}>
              {option.name}: {JSON.stringify(option.resources)}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

